import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();

    // ✅ ID fijo sincronizado con tu tabla api_keys de Supabase para desarrollo
    const FINAL_USER_ID = "juan_dev_34";

    const RAILWAY_URL = "https://web-production-4f439.up.railway.app/v1/dispatch";
    // Cache busting para asegurar ruteo neuronal fresco
    const FINAL_URL = `${RAILWAY_URL}?t=${Date.now()}`;

    console.log("🚀 Enviando Uplink a Railway:", { user_id: FINAL_USER_ID, session_id: sessionId });

    // Enlace al Nodo Neuronal en Railway
    const response = await fetch(FINAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Clave de producción verificada en tu backend
        'X-API-KEY': 'nr-dev-secret-123',
      },
      body: JSON.stringify({
        messages: messages,
        user_id: FINAL_USER_ID,
        session_id: sessionId || "default_session"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Railway Status:", response.status);
      console.error("❌ Railway Error Detail:", JSON.stringify(errorData));
      throw new Error(errorData.detail || `Neural Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Respuesta de Nodo Neuronal recibida");

    // Respuesta formateada para el Frontend del Chat
    return NextResponse.json({
      role: 'assistant',
      content: data.output?.ai_answer || data.content,
      suggested_title: data.suggested_title || null,
      routing: {
        model_used: data.routing?.model_used || "Neural Node",
        tier: data.routing?.tier || "Standard",
        confidence: data.routing?.confidence || 1.0
      },
      business_metrics: {
        estimated_savings_usd: data.business_metrics?.estimated_savings_usd || 0,
        water_l: data.business_metrics?.water_l || "0.0125L"
      }
    });

  } catch (error: any) {
    console.error("❌ Neural Link Failure:", error.message);
    return NextResponse.json({ 
      role: 'assistant', 
      content: `System Error: ${error.message}. Ensure Railway infrastructure is online.` 
    }, { status: 500 });
  }
}