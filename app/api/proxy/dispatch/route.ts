import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    // 1. Validar Sesión de Clerk
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: No Clerk Session" }, { status: 0 }); // Usamos 401
    }

    // 2. Validar que el Body sea JSON válido
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    // 3. Configuración de Backend
    const apiKey = process.env.NR_PRIVATE_KEY || 'nr-dev-secret-123';
    const RAILWAY_ENDPOINT = 'https://web-production-4f439.up.railway.app/v1/dispatch';

    // 4. Llamada al Backend de Railway
    const response = await fetch(RAILWAY_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey
      },
      body: JSON.stringify({
        messages: body.messages || [],
        user_id: userId, // Usamos el ID verificado de Clerk
        session_id: "dashboard_live_test"
      }),
      cache: 'no-store'
    });

    // 5. Manejar errores del Backend (Railway)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Railway Error [${response.status}]:`, errorText);
      return NextResponse.json({ 
        error: "Railway Backend Failed", 
        status: response.status,
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    // Aquí es donde ocurría el error 500 sin explicación
    console.error("CRITICAL PROXY ERROR:", error.message);
    return NextResponse.json({ 
      error: "Internal Server Error in Proxy", 
      details: error.message 
    }, { status: 500 });
  }
}
