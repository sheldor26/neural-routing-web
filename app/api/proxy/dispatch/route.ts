import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function POST(req: Request) {
  try {
    // Validamos que el usuario esté logueado en Clerk para este proxy
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized Clerk Session" }, { status: 401 });
    }

    const body = await req.json();
    
    // IMPORTANTE: Verifica que NR_PRIVATE_KEY esté en tus variables de Vercel
    const apiKey = process.env.NR_PRIVATE_KEY || 'nr-dev-secret-123';
    const RAILWAY_ENDPOINT = 'https://web-production-4f439.up.railway.app/v1/dispatch';

    const response = await fetch(RAILWAY_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey
      },
      body: JSON.stringify({
        ...body,
        user_id: userId // Pasamos el ID real de Clerk al backend
      }),
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json({ error: "Railway Error", details: data }, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Proxy Failure", details: error.message }, { status: 500 });
  }
}