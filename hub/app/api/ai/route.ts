// Built by vsrupeshkumar
// Server-side OpenAI proxy for the RWAkins AI CFO. Keeps OPENAI_API_KEY off the
// client. Used by the onboarding IntentChat to confirm a parsed wealth policy
// back to the user in natural language. Returns { error: 'AI_DISABLED' } when no
// key is configured so the client can fall back to its deterministic message.
import { NextResponse } from 'next/server'
import { chat, hasOpenAIKey } from '@/lib/openai'

const SYSTEM_PROMPT =
  'You are the RWAkins AI CFO, an autonomous treasury agent on Mantle Network. ' +
  'You manage a two-asset real-world-asset portfolio: USDY (Ondo tokenized US ' +
  'treasuries, the stable yield leg) and mETH (Mantle liquid-staked ETH, the ' +
  'higher-risk growth leg). Be concise, warm, and specific. Never promise returns. ' +
  'Always respect the on-chain hard cap: mETH can never exceed 70% of the portfolio.'

export async function POST(req: Request) {
  if (!hasOpenAIKey()) {
    return NextResponse.json({ error: 'AI_DISABLED' }, { status: 503 })
  }

  let message: string
  try {
    const body = await req.json()
    message = String(body?.message ?? '').slice(0, 2000)
    if (!message.trim()) {
      return NextResponse.json({ error: 'EMPTY_MESSAGE' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 })
  }

  const text = await chat({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ],
    temperature: 0.5,
    maxTokens: 200,
  })

  if (text == null) {
    return NextResponse.json({ error: 'UPSTREAM_FAILED' }, { status: 502 })
  }
  return NextResponse.json({ text })
}
