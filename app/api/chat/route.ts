import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();

    // ✅ ID sincronizado con el registro de desarrollador en Supabase
    const FINAL_USER_ID = "juan_dev_34";

    const RAILWAY_URL = "https://web-production-4f439.up.railway.app/v1/dispatch";
    // Timestamp para forzar frescura en el ruteo neuronal
    const FINAL_URL = `${RAILWAY_URL}?t=${Date.now()}`;

    console.log("🚀 Iniciando Uplink a Railway:", { user_id: FINAL_USER_ID, session_id: sessionId });

    // Enlace al Nodo Neuronal en Railway
    const response = await fetch(FINAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Clave secreta validada en la tabla api_keys de Supabase
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
      console.error("❌ Railway Status Error:", response.status);
      console.error("❌ Railway Detail:", JSON.stringify(errorData));
      throw new Error(errorData.detail || `Neural Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Sincronización con Nodo Neuronal exitosa");

    // Respuesta optimizada para el Frontend
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