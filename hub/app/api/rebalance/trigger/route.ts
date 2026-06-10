// Built by vsrupeshkumar
// POST /api/rebalance/trigger — the RWAkins agent BRAIN (spec steps 2-4).
//
//   Step 2  Intent      — read the wallet's stored wealth rules
//   Step 3  Monitor     — fetch live ETH price + 24h change from CoinGecko
//   Step 4  Risk eval   — GPT-4o-mini decides the target split (deterministic
//                         fallback), the Byreal Agent Skills layer signals the
//                         swap action, and the 4-agent council debates + votes
//
// This endpoint NEVER fabricates a tx hash and NEVER logs a fake activity. It
// returns the DECISION only. Step 5 (on-chain execution) happens client-side via
// vault.rebalance() (lib/rwa/vaultClient) using the user's wallet, producing a
// REAL Mantle tx hash, which is then logged via POST /api/activity.
import { NextResponse } from 'next/server'
import { getIntent } from '@/lib/intentStore'
import { parseIntent, type WealthRules } from '@/lib/intent'
import { evaluateCouncil } from '@/lib/aiCouncil/council'
import { byrealSignal, type SwapAction } from '@/lib/byreal'
import { chatJson } from '@/lib/openai'

export const runtime = 'nodejs'

const CG_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true'

interface Market {
  ethPrice: number
  eth24hChange: number
  live: boolean
}

async function fetchMarket(): Promise<Market> {
  try {
    const r = await fetch(CG_URL, { next: { revalidate: 120 } })
    if (!r.ok) throw new Error('CG error')
    const j = await r.json()
    const price = j?.ethereum?.usd
    const change = j?.ethereum?.usd_24h_change
    if (typeof price !== 'number') throw new Error('no price')
    return { ethPrice: price, eth24hChange: typeof change === 'number' ? change : 0, live: true }
  } catch {
    // CoinGecko unreachable — neutral snapshot (no rebalance gets forced).
    return { ethPrice: 0, eth24hChange: 0, live: false }
  }
}

interface Decision {
  shouldRebalance: boolean
  newMethPct: number
  direction: SwapAction
  reason: string
}

// Deterministic risk evaluation — the always-available fallback / sanity guard.
function evaluateRiskDeterministic(rules: WealthRules, market: Market, currentMethPct: number): Decision {
  const targetMethPct = rules.targetMethBps / 100
  const drift = Math.abs(currentMethPct - targetMethPct)
  const highVol = market.eth24hChange < -4
  const bullish = market.eth24hChange > 3

  if (highVol && currentMethPct > 20) {
    return {
      shouldRebalance: true,
      newMethPct: Math.max(targetMethPct - 10, 20),
      direction: 'de-risk',
      reason: `ETH is down ${Math.abs(market.eth24hChange).toFixed(1)}% in 24h — exceeds your volatility hedge threshold`,
    }
  }
  if (bullish && currentMethPct < targetMethPct - rules.rebalanceThresholdPct) {
    return {
      shouldRebalance: true,
      newMethPct: Math.min(targetMethPct, 70),
      direction: 'rotate-in',
      reason: `ETH is up ${market.eth24hChange.toFixed(1)}% in 24h — rotating into mETH to capture staking yield`,
    }
  }
  if (drift >= rules.rebalanceThresholdPct) {
    return {
      shouldRebalance: true,
      newMethPct: targetMethPct,
      direction: currentMethPct > targetMethPct ? 'de-risk' : 'rotate-in',
      reason: `Allocation drifted ${drift.toFixed(1)}% from your ${targetMethPct.toFixed(0)}% mETH target`,
    }
  }
  return { shouldRebalance: false, newMethPct: currentMethPct, direction: 'hold', reason: 'Allocation within target band — no action needed' }
}

// GPT-4o-mini risk evaluation. Returns null on any failure → deterministic.
async function evaluateRiskLLM(
  rules: WealthRules,
  market: Market,
  currentMethPct: number,
  apy: { usdyApy: number; methApy: number },
): Promise<Decision | null> {
  const raw = await chatJson<{
    shouldRebalance?: boolean
    newMethPct?: number
    direction?: string
    reason?: string
  }>({
    messages: [
      {
        role: 'system',
        content:
          'You are the risk-evaluation engine of an AI CFO managing a two-asset RWA ' +
          'portfolio on Mantle: USDY (stable treasury yield) and mETH (staked-ETH, the ' +
          'volatile leg). Given the market snapshot and the user\'s wealth rules, decide ' +
          'whether to rebalance and the new mETH target percentage. HARD RULE: newMethPct ' +
          'must be between 0 and 70. Respond with ONLY JSON: {"shouldRebalance":boolean,' +
          '"newMethPct":number,"direction":"rotate-in"|"de-risk"|"hold","reason":string}. ' +
          'Keep reason under 140 chars, specific and plain-English.',
      },
      {
        role: 'user',
        content: JSON.stringify({
          market: { ethPrice: market.ethPrice, eth24hChangePct: Number(market.eth24hChange.toFixed(2)) },
          yields: { usdyApyPct: apy.usdyApy, methApyPct: apy.methApy },
          rules: {
            riskLevel: rules.riskLevel,
            targetMethPct: rules.targetMethBps / 100,
            rebalanceThresholdPct: rules.rebalanceThresholdPct,
            autoRebalance: rules.autoRebalance,
          },
          currentMethPct,
        }),
      },
    ],
    temperature: 0.2,
    timeoutMs: 12_000,
    maxTokens: 160,
  })

  if (!raw || typeof raw.newMethPct !== 'number' || typeof raw.shouldRebalance !== 'boolean') return null
  const newMethPct = Math.max(0, Math.min(70, raw.newMethPct))
  const direction: SwapAction =
    raw.direction === 'rotate-in' || raw.direction === 'de-risk' || raw.direction === 'hold'
      ? raw.direction
      : newMethPct > currentMethPct ? 'rotate-in' : newMethPct < currentMethPct ? 'de-risk' : 'hold'
  return {
    shouldRebalance: raw.shouldRebalance,
    newMethPct,
    direction,
    reason: (raw.reason || 'Adjusting allocation toward your target.').slice(0, 200),
  }
}

function buildNarrative(d: Decision, before: { usdy: number; meth: number }, after: { usdy: number; meth: number }): string {
  const delta = Math.abs(after.meth - before.meth).toFixed(0)
  if (d.direction === 'de-risk') return `De-risked ${delta}% from mETH into USDY. Reason: ${d.reason}.`
  if (d.direction === 'rotate-in') return `Rotated ${delta}% from USDY into mETH to capture higher staking yield. Reason: ${d.reason}.`
  return `Re-affirmed allocation at ${after.usdy.toFixed(0)}% USDY / ${after.meth.toFixed(0)}% mETH. ${d.reason}.`
}

interface Body {
  wallet?: string
  currentMethPct?: number
  targetUsdyBps?: number
  targetMethBps?: number
  usdyApyBps?: number
  methApyBps?: number
}

export async function POST(req: Request) {
  let body: Body
  try { body = (await req.json()) as Body } catch { body = {} }

  const wallet = (body.wallet ?? '').trim()
  if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'INVALID_ADDRESS' }, { status: 400 })
  }

  // Step 2 — wealth rules (fall back to medium-risk defaults).
  const stored = getIntent(wallet)
  const rules: WealthRules = stored ?? parseIntent('balanced medium risk auto-rebalance')

  // Step 3 — live market snapshot.
  const market = await fetchMarket()

  // Real, on-chain yields passed from the client (bps → %). Default to the
  // mock-token APYs only if the client couldn't read them.
  const apy = {
    usdyApy: typeof body.usdyApyBps === 'number' ? body.usdyApyBps / 100 : 4.8,
    methApy: typeof body.methApyBps === 'number' ? body.methApyBps / 100 : 3.6,
  }

  // Current allocation from the client's real on-chain read (no simulated drift).
  const currentMethPct = Math.min(70, Math.max(0, typeof body.currentMethPct === 'number' ? body.currentMethPct : rules.targetMethBps / 100))

  // Step 4 — risk evaluation (LLM, deterministic fallback).
  const decision = (await evaluateRiskLLM(rules, market, currentMethPct, apy)) ?? evaluateRiskDeterministic(rules, market, currentMethPct)

  const rawMeth = Math.round(Math.min(70, Math.max(0, currentMethPct)))
  const before = { usdy: 100 - rawMeth, meth: rawMeth }
  const newMeth = Math.round(Math.min(70, Math.max(0, decision.newMethPct)))
  const after = { usdy: 100 - newMeth, meth: newMeth }

  const narrative = buildNarrative(decision, before, after)

  // Byreal Agent Skills decision-layer signal.
  const byreal = await byrealSignal({ eth24hChange: market.eth24hChange, direction: decision.direction })

  // 4-agent council debate + vote, using the REAL yields/allocation.
  const council = evaluateCouncil({
    ethChange24h: market.eth24hChange,
    usdyApy: apy.usdyApy,
    methApy: apy.methApy,
    currentMethPct,
    volatility: Math.abs(market.eth24hChange) * 4 + 12,
    usdyBps: before.usdy * 100,
    methBps: before.meth * 100,
    proposedUsdyBps: after.usdy * 100,
    proposedMethBps: after.meth * 100,
  })

  const usdyBps = body.targetUsdyBps
  const methBps = body.targetMethBps

  return NextResponse.json({
    ok: true,
    shouldRebalance: decision.shouldRebalance && !council.vetoed,
    decision: { usdyBps, methBps, direction: decision.direction, newMethPct: newMeth },
    narrative,
    aiRationale: decision.reason,
    allocationBefore: before,
    allocationAfter: after,
    market: { ethPrice: Math.round(market.ethPrice * 100) / 100, eth24hChange: Math.round(market.eth24hChange * 10) / 10, live: market.live },
    byreal,
    council,
    rulesUsed: !!stored,
  })
}
