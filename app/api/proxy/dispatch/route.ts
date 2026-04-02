import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    
    // IMPORTANTE: Asegúrate de que esta URL sea la de "Public Networking" en Railway
    const RAILWAY_ENDPOINT = 'https://web-production-4f439.up.railway.app/v1/dispatch';
    const apiKey = process.env.NR_PRIVATE_KEY || 'nr-dev-secret-123';

    const response = await fetch(RAILWAY_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey
      },
      body: JSON.stringify({
        messages: body.messages, // Pasamos el array de mensajes
        user_id: userId,        // ID de Clerk
        session_id: "dashboard_test"
      }),
      cache: 'no-store'
    });

    const data = await response.json();
    if (!response.ok) {
        console.error("Backend Error:", data);
        return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Proxy Crash", details: error.message }, { status: 500 });
  }
}