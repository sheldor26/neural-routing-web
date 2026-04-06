import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { API_BASE } from '@/lib/config';
const RAILWAY_ENDPOINT = `${API_BASE}/v1/dispatch`;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const apiKey = process.env.NR_PRIVATE_KEY;
    if (!apiKey) {
      console.error('NR_PRIVATE_KEY env var is not set');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const response = await fetch(RAILWAY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({
        messages: body.messages || [],
        user_id: userId,
        session_id: body.session_id || 'proxy',
      }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Railway error [${response.status}]:`, data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('PROXY_ERROR:', error.message);
    return NextResponse.json({ error: 'Internal proxy error', details: error.message }, { status: 500 });
  }
}
