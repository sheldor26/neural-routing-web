import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Recibimos los datos del componente de React
    // IMPORTANTE: Asegurate que el frontend esté enviando 'sessionId'
    const { messages, userId, sessionId } = await req.json();

    const RAILWAY_URL = "https://web-production-4f439.up.railway.app/v1/dispatch";
    const FINAL_URL = `${RAILWAY_URL}?t=${Date.now()}`;

    // 2. Llamada al Nodo Neural
    const response = await fetch(FINAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'key_demo_user', 
      },
      body: JSON.stringify({
        // ESTO ES LO QUE CAMBIÓ: Enviamos la lista completa y el ID de sesión
        messages: messages, 
        user_id: userId || "guest_user",
        session_id: sessionId || "default_session" 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Detalle del error en Railway:", errorData);
      throw new Error(errorData.detail || `Neural Error: ${response.status}`);
    }

    const data = await response.json();

    // 3. Respuesta formateada para el Chat UI
    return NextResponse.json({
      role: 'assistant',
      content: data.output.ai_answer,
      stats: {
        model: data.routing.model_used,
        tier: data.routing.tier,
        savings: `$${data.business_metrics.estimated_savings_usd}`,
        water: data.business_metrics.water_l || "0.0125L"
      }
    });

  } catch (error: any) {
    console.error("❌ Neural Link Failure:", error.message);
    return NextResponse.json({ 
      role: 'assistant', 
      content: `System Error: ${error.message}. Verifica que Railway esté activo.` 
    }, { status: 500 });
  }
}