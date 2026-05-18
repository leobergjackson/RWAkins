'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  generateScore,
  fetchScoreBreakdown,
  predictScore,
  fetchOraclePrice,
  type NcBreakdown,
  type NcPrediction,
} from '../../lib/neurocredit-api'
import {
  getRating,
  fallbackBreakdown,
  SCENARIO_LABELS,
  SCENARIO_DESCRIPTIONS,
  type StakingTier,
} from '../../lib/neurocredit-fallbacks'
import {
  isMetaMaskInstalled,
  truncateAddress,
  switchToQIE,
  loadWallet,
  persistWallet,
  clearWallet,
  WALLET_INSTALL_LINKS,
  QIE_MAINNET,
} from '../../lib/wallet-utils'
import { toast } from '../../lib/toast'

// ─── Gauge math ──────────────────────────────────────────────
const GAUGE_R = 90
const GAUGE_CX = 110
const GAUGE_CY = 110
const GAUGE_CIRC = 2 * Math.PI * GAUGE_R  // 565.49
const GAUGE_ARC = GAUGE_CIRC * 0.75       // 424.12

function gaugeLen(score: number) {
  return Math.max(0, Math.min((score / 1000) * GAUGE_ARC, GAUGE_ARC))
}

// ─── Sub-components ───────────────────────────────────────────
function CreditGauge({ score, loading }: { score: number; loading: boolean }) {
  const [animLen, setAnimLen] = useState(0)

  useEffect(() => {
    if (loading) { setAnimLen(0); return }
    const t = setTimeout(() => setAnimLen(gaugeLen(score)), 120)
    return () => clearTimeout(t)
  }, [score, loading])

  const { label, color } = getRating(score)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: 220, height: 220 }}>
        <svg viewBox="0 0 220 220" width={220} height={220}>
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B5BFA" />
            </linearGradient>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle
            cx={GAUGE_CX} cy={GAUGE_CY} r={GAUGE_R}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={16}
            strokeDasharray={`${GAUGE_ARC} 999`}
            strokeLinecap="round"
            transform={`rotate(135 ${GAUGE_CX} ${GAUGE_CY})`}
          />
          {/* Active arc */}
          <circle
            cx={GAUGE_CX} cy={GAUGE_CY} r={GAUGE_R}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth={16}
            strokeDasharray={`${animLen} 999`}
            strokeLinecap="round"
            transform={`rotate(135 ${GAUGE_CX} ${GAUGE_CY})`}
            filter="url(#gaugeGlow)"
            style={{ transition: 'stroke-dasharray 1.3s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {loading ? (
            <div
              style={{
                width: 40,
                height: 40,
                border: '3px solid rgba(255,255,255,0.1)',
                borderTop: '3px solid #8B5CF6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          ) : (
            <>
              <p style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, margin: 0, color: '#fff', letterSpacing: '-2px' }}>
                {score}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>/ 1000</p>
            </>
          )}
        </div>
      </div>

      {/* Rating badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '5px 16px',
          borderRadius: 20,
          background: `${color}18`,
          border: `1px solid ${color}45`,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 8px ${color}`,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 600, color }}>{label}</span>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function ProgressBar({
  value,
  max,
  color,
  label,
  displayValue,
}: {
  value: number
  max: number
  color: string
  label: string
  displayValue: string
}) {
  const pct = Math.max(0, Math.min((value / max) * 100, 100))
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
        <span style={{ fontWeight: 600, color }}>{displayValue}</span>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 99,
            transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
    </div>
  )
}

// ─── Style helpers ───────────────────────────────────────────
const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 14,
  padding: '20px 22px',
}

const btnPrimary: React.CSSProperties = {
  background: 'linear-gradient(135deg, #8B5CF6, #3B5BFA)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
}

const btnOutline: React.CSSProperties = {
  background: 'transparent',
  color: 'rgba(255,255,255,0.6)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 8,
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
}

// ─── Page ─────────────────────────────────────────────────────
export default function CreditDashboard() {
  const [wallet, setWallet] = useState('')
  const [score, setScore] = useState(650)
  const [explanation, setExplanation] = useState('Based on on-chain analysis')
  const [refreshTxHash, setRefreshTxHash] = useState('')
  const [breakdown, setBreakdown] = useState<NcBreakdown>(fallbackBreakdown)
  const [oraclePrice, setOraclePrice] = useState(2.45)
  const [loading, setLoading] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const [error, setError] = useState('')

  const [scenario, setScenario] = useState('')
  const [prediction, setPrediction] = useState<NcPrediction | null>(null)
  const [predicting, setPredicting] = useState(false)

  const installed = useMemo(() => (typeof window === 'undefined' ? true : isMetaMaskInstalled()), [])

  useEffect(() => {
    const saved = loadWallet('evm')
    if (saved) setWallet(saved)
    fetchOraclePrice().then(setOraclePrice)
  }, [])

  useEffect(() => {
    if (!wallet) return
    loadDashboard(wallet)
  }, [wallet])

  async function loadDashboard(addr: string) {
    setLoading(true)
    setError('')
    const [bd] = await Promise.all([
      fetchScoreBreakdown(addr),
      fetchOraclePrice().then(setOraclePrice),
    ])
    setBreakdown(bd)
    setScore(bd.score)
    setIsDemo(bd.score === fallbackBreakdown.score && bd.baseScore === fallbackBreakdown.baseScore)
    setLoading(false)
  }

  async function connect() {
    setError('')
    try {
      if (!isMetaMaskInstalled()) throw new Error('MetaMask is not installed.')
      await switchToQIE()
      const accounts = (await (window as any).ethereum.request({ method: 'eth_requestAccounts' })) as string[]
      const address = accounts[0] || ''
      setWallet(address)
      persistWallet('evm', address)
      toast.success('Connected to QIE Mainnet')
    } catch (err: any) {
      const msg = err?.message || 'Unable to connect wallet.'
      setError(msg)
      toast.error(msg)
    }
  }

  function disconnect() {
    setWallet('')
    clearWallet('evm')
    setScore(650)
    setBreakdown(fallbackBreakdown)
    setRefreshTxHash('')
    setPrediction(null)
    setIsDemo(false)
    toast.success('Wallet disconnected')
  }

  async function refreshScore() {
    if (!wallet) return
    setLoading(true)
    setRefreshTxHash('')
    setError('')
    const res = await generateScore(wallet)
    setScore(res.score)
    setExplanation(res.explanation || 'Based on on-chain analysis')
    if (res.transactionHash) setRefreshTxHash(res.transactionHash)
    setIsDemo(!res.transactionHash)
    // Also refresh breakdown
    const bd = await fetchScoreBreakdown(wallet)
    setBreakdown(bd)
    setLoading(false)
    toast.success(res.transactionHash ? 'Score refreshed on-chain' : 'Score refreshed (demo mode)')
  }

  async function runPredictor() {
    if (!scenario || !wallet) return
    setPredicting(true)
    setPrediction(null)
    const res = await predictScore(wallet, scenario as any)
    setPrediction(res)
    setPredicting(false)
  }

  const stakingTierLabel = (tier: StakingTier) => {
    if (tier === 'None') return 'None'
    return tier
  }

  return (
    <main style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}>
      {/* ── Header ── */}
      <header style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#8B5CF6', marginBottom: 4 }}>
            CREDIT PASSPORT
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>Your Credit Score</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
            Based on on-chain analysis
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 20,
              background: isDemo ? 'rgba(255,255,255,0.04)' : 'rgba(34,197,94,0.06)',
              border: `1px solid ${isDemo ? 'rgba(255,255,255,0.1)' : 'rgba(34,197,94,0.3)'}`,
              color: isDemo ? '#888' : '#22C55E',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDemo ? '#888' : '#22C55E', flexShrink: 0 }} />
            {isDemo ? 'Demo Mode' : 'Live'}
          </span>
          <span
            style={{
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 20,
              background: 'rgba(245,197,24,0.06)',
              border: '1px solid rgba(245,197,24,0.25)',
              color: '#F5C518',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5C518', flexShrink: 0 }} />
            QIE Mainnet
          </span>
        </div>
      </header>

      {/* ── No MetaMask ── */}
      {!installed && (
        <div style={{ ...card, marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>MetaMask is required to use NeuroCredit.</p>
          <a href={WALLET_INSTALL_LINKS.metamask} target="_blank" rel="noopener noreferrer" style={btnPrimary}>
            Install MetaMask
          </a>
        </div>
      )}

      {/* ── Connect wallet ── */}
      {installed && !wallet && (
        <div style={{ ...card, marginBottom: 20, textAlign: 'center', padding: '40px 24px' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 28,
            }}
          >
            🧠
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Connect your wallet</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
            Connect MetaMask on QIE Mainnet (Chain ID {QIE_MAINNET.chainId}) to generate your credit score.
          </p>
          <button style={btnPrimary} onClick={connect}>
            Connect MetaMask
          </button>
          {error && <p style={{ color: '#F87171', marginTop: 10, fontSize: 13 }}>{error}</p>}
        </div>
      )}

      {/* ── Connected Dashboard ── */}
      {wallet && (
        <>
          {/* Wallet bar */}
          <div
            style={{
              ...card,
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
              padding: '12px 18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B5CF6, #3B5BFA)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                👤
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                {truncateAddress(wallet)}
              </span>
              <span
                style={{
                  fontSize: 10,
                  padding: '3px 8px',
                  borderRadius: 12,
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.25)',
                  color: '#A78BFA',
                }}
              >
                {QIE_MAINNET.chainName}
              </span>
            </div>
            <button onClick={disconnect} style={btnOutline}>
              Disconnect
            </button>
          </div>

          {/* ── Main 2-col layout ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 20,
              marginBottom: 20,
            }}
          >
            {/* Score Gauge panel */}
            <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <CreditGauge score={score} loading={loading} />
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.5, maxWidth: 280 }}>
                {explanation}. Stake NCRD to boost your score further.
              </p>

              {/* Refresh button */}
              <button
                style={{
                  ...btnPrimary,
                  width: '100%',
                  justifyContent: 'center',
                  opacity: loading ? 0.7 : 1,
                }}
                onClick={refreshScore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid #fff',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        display: 'inline-block',
                      }}
                    />
                    Refreshing…
                  </>
                ) : (
                  '↻ Refresh Score'
                )}
              </button>

              {refreshTxHash && (
                <div
                  style={{
                    width: '100%',
                    background: 'rgba(139,92,246,0.06)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontSize: 12,
                  }}
                >
                  <p style={{ color: '#A78BFA', fontWeight: 600, margin: '0 0 4px' }}>On-chain ✓</p>
                  <p style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', margin: 0, wordBreak: 'break-all' }}>
                    Tx: {refreshTxHash.slice(0, 18)}…{refreshTxHash.slice(-8)}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                {
                  icon: '🧠',
                  title: 'NeuroLend',
                  desc: 'Get personalized loan offers',
                  href: '/credit/lend',
                  accent: '#8B5CF6',
                },
                {
                  icon: '🛡',
                  title: 'Stake NCRD',
                  desc: 'Boost your credit score',
                  href: '/credit/stake',
                  accent: '#22C55E',
                },
                {
                  icon: '⚡',
                  title: 'DeFi Demo',
                  desc: 'See your borrowing power',
                  href: '/credit/lending-demo',
                  accent: '#F5C518',
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    ...card,
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 18px',
                    transition: 'border-color 0.2s, background 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: `${item.accent}15`,
                      border: `1px solid ${item.accent}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: 14, color: item.accent }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>{item.desc}</p>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>›</span>
                </Link>
              ))}

              {/* Bottom stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ ...card, padding: '14px 16px' }}>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.08em', margin: '0 0 4px' }}>
                    ORACLE PRICE
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#60A5FA', margin: 0 }}>
                    ${oraclePrice.toFixed(2)}
                  </p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>QIE / USD</p>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 9,
                      color: '#22C55E',
                      marginTop: 4,
                    }}
                  >
                    <span className="live-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                    Live
                  </span>
                </div>
                <div style={{ ...card, padding: '14px 16px' }}>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.08em', margin: '0 0 4px' }}>
                    STAKING TIER
                  </p>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color:
                        breakdown.stakingTier === 'Gold'
                          ? '#F5C518'
                          : breakdown.stakingTier === 'Silver'
                          ? '#9CA3AF'
                          : breakdown.stakingTier === 'Bronze'
                          ? '#F97316'
                          : 'rgba(255,255,255,0.35)',
                      margin: 0,
                    }}
                  >
                    {stakingTierLabel(breakdown.stakingTier)}
                  </p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>
                    Boost: +{breakdown.stakingBoost}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Score Breakdown + Predictor row ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {/* Score Breakdown */}
            <div style={card}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', margin: '0 0 16px' }}>
                SCORE BREAKDOWN
              </p>
              <ProgressBar
                label="Base Score"
                value={breakdown.baseScore}
                max={1000}
                color="rgba(255,255,255,0.4)"
                displayValue={String(breakdown.baseScore)}
              />
              <ProgressBar
                label="Staking Boost"
                value={breakdown.stakingBoost}
                max={300}
                color="#22C55E"
                displayValue={`+${breakdown.stakingBoost}`}
              />
              <ProgressBar
                label="Oracle Penalty"
                value={breakdown.oraclePenalty}
                max={200}
                color="#EF4444"
                displayValue={breakdown.oraclePenalty === 0 ? '0' : `-${breakdown.oraclePenalty}`}
              />
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                  {breakdown.baseScore} + {breakdown.stakingBoost} − {breakdown.oraclePenalty} =
                </span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#A78BFA' }}>{score}</span>
              </div>
              {breakdown.lastUpdated && (
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 10 }}>
                  Updated: {new Date(breakdown.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>

            {/* Score Predictor */}
            <div style={card}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', margin: '0 0 16px' }}>
                SCORE PREDICTOR
              </p>
              <div style={{ marginBottom: 12 }}>
                <select
                  value={scenario}
                  onChange={(e) => { setScenario(e.target.value); setPrediction(null) }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 8,
                    color: scenario ? '#fff' : 'rgba(255,255,255,0.35)',
                    fontSize: 13,
                    cursor: 'pointer',
                    appearance: 'none',
                  }}
                >
                  <option value="" disabled style={{ background: '#1a1a1a' }}>Select a scenario</option>
                  {Object.entries(SCENARIO_LABELS).map(([key, label]) => (
                    <option key={key} value={key} style={{ background: '#1a1a1a' }}>
                      {label} — {SCENARIO_DESCRIPTIONS[key]}
                    </option>
                  ))}
                </select>
              </div>

              <button
                style={{
                  ...btnPrimary,
                  width: '100%',
                  justifyContent: 'center',
                  opacity: !scenario || predicting ? 0.6 : 1,
                }}
                onClick={runPredictor}
                disabled={!scenario || predicting}
              >
                {predicting ? 'Predicting…' : 'Predict Score Change'}
              </button>

              {prediction && (
                <div
                  style={{
                    marginTop: 16,
                    background: 'rgba(139,92,246,0.06)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    borderRadius: 10,
                    padding: '14px 16px',
                  }}
                >
                  <p style={{ fontSize: 12, color: '#A78BFA', fontWeight: 600, margin: '0 0 8px' }}>
                    If you: {SCENARIO_LABELS[scenario]}
                  </p>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Current</p>
                      <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>{prediction.currentScore}</p>
                    </div>
                    <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.2)' }}>→</span>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Predicted</p>
                      <p style={{ fontSize: 22, fontWeight: 700, color: '#22C55E', margin: 0 }}>
                        {prediction.predictedScore}{' '}
                        <span style={{ fontSize: 14 }}>
                          (+{prediction.change})
                        </span>
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>
                    {prediction.explanation}
                  </p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: '8px 0 0' }}>
                    Confidence: {Math.round(prediction.confidence * 100)}%
                  </p>
                </div>
              )}

              {!prediction && !predicting && (
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 14, textAlign: 'center' }}>
                  Select a scenario to see how actions affect your score
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  )
}
