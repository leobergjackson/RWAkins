// Built by vsrupeshkumar
// Quick auth test for the Pinata JWT. Visit /api/pinata/test in a browser
// to verify the JWT is valid before relying on the upload route.
// Returns { ok: true, user: ... } or { ok: false, error: ... }.
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const jwt = process.env.PINATA_JWT
  if (!jwt) return NextResponse.json({ ok: false, error: 'PINATA_JWT not set' }, { status: 503 })
  if (!jwt.startsWith('eyJ') || jwt.length < 100) {
    return NextResponse.json({ ok: false, error: 'PINATA_JWT looks malformed' }, { status: 503 })
  }
  try {
    const res = await fetch('https://api.pinata.cloud/data/testAuthentication', {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      return NextResponse.json({ ok: false, error: `HTTP ${res.status}: ${txt.slice(0, 200)}` }, { status: 502 })
    }
    const json = await res.json()
    return NextResponse.json({ ok: true, message: json?.message ?? 'authenticated' })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : 'network' }, { status: 504 })
  }
}
