import { NextResponse } from 'next/server';
import { corsHeaders } from '../_utils/cors';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'palmflow',
  }, { headers: corsHeaders });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
