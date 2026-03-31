import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();
    
    // Extraemos el último mensaje (lo que el usuario acaba de escribir)
    const lastMessage = messages[messages.length - 1].content;

    // USAMOS LA URL QUE YA SABEMOS QUE FUNCIONA EN EL PLAYGROUND
    const RAILWAY_URL = "https://web-production-4f439.up.railway.app/v1/dispatch";
    
    // Agregamos el timestamp para evitar cache (como en tu Playground)
    const FINAL_URL = `${RAILWAY_URL}?t=${Date.now()}`;

    const response = await fetch(FINAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'key_demo_user', // Tu llave verificada
      },
      body: JSON.stringify({
        prompt: lastMessage,
        user_id: userId || "guest_user" 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Neural Error: ${response.status}`);
    }

    const data = await response.json();

    // IMPORTANTE: Mapeamos la respuesta para que el componente de Chat la renderice bien
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
      content: "Error: No se pudo establecer conexión segura con el Nodo Neural en Railway." 
    }, { status: 500 });
  }
}