import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'kubryx-hub',
    tools: 8,
    chains: 4,
    timestamp: new Date().toISOString(),
  })
}
