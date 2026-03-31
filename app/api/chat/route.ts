// app/api/chat/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();
    
    // IMPORTANTE: Ya no extraemos solo el lastMessage. 
    // Enviamos el array 'messages' completo para que el backend tenga contexto.

    const RAILWAY_URL = "https://web-production-4f439.up.railway.app/v1/dispatch";
    const FINAL_URL = `${RAILWAY_URL}?t=${Date.now()}`;

    const response = await fetch(FINAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'key_demo_user',
      },
      body: JSON.stringify({
        // CAMBIO CLAVE: Enviamos 'messages' en lugar de 'prompt'
        messages: messages, 
        user_id: userId || "guest_user" 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Neural Node Error Details:", errorData);
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
      content: `System Error: ${error.message}. Check Railway logs for 422 errors.` 
    }, { status: 500 });
  }
}