import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();
    
    // CONSTRUCCIÓN DEL CONTEXTO:
    // Tomamos los últimos 4 mensajes para que el modelo tenga memoria
    // Formato: "User: mensaje \n Assistant: respuesta"
    const contextLimit = 5;
    const conversationContext = messages
      .slice(-contextLimit)
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const RAILWAY_URL = "https://web-production-4f439.up.railway.app/v1/dispatch";
    const FINAL_URL = `${RAILWAY_URL}?t=${Date.now()}`;

    const response = await fetch(FINAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'key_demo_user',
      },
      body: JSON.stringify({
        // Enviamos el bloque de texto con la historia de la charla
        prompt: conversationContext, 
        user_id: userId || "guest_user" 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Neural Error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      role: 'assistant',
      content: data.output.ai_answer,
      stats: {
        model: data.routing.model_used,
        tier: data.routing.selected_tier || data.routing.tier,
        latency: `${Math.round(data.routing.latency_ms)}ms`,
        savings: `$${data.business_metrics.estimated_savings_usd}`,
        water: "0.0125L" 
      }
    });

  } catch (error: any) {
    console.error("❌ Neural Link Failure:", error.message);
    return NextResponse.json({ 
      role: 'assistant', 
      content: "Error: No se pudo establecer conexión segura con el Nodo Neural." 
    }, { status: 500 });
  }
}