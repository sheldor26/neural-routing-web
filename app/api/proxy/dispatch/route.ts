import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Usamos el secreto desde variables de entorno
    const apiKey = process.env.NR_PRIVATE_KEY || 'nr-dev-secret-123';

    const response = await fetch('https://web-production-4f439.up.railway.app/v1/dispatch', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey
      },
      body: JSON.stringify(body)
    });

    // Si el backend real devuelve error, lo capturamos
    if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ error: "Backend Error", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}