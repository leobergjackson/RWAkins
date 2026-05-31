// Built by vsrupeshkumar
import { NextResponse } from 'next/server'
import { corsHeaders } from '../../_utils/cors'

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: 'ciphervault',
      score: 0,
    },
    { headers: corsHeaders }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}
