import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();

    // ✅ ID fijo que existe en tu tabla api_keys de Supabase
    const FINAL_USER_ID = "juan_dev_34";

    const RAILWAY_URL = "https://web-production-4f439.up.railway.app/v1/dispatch";
    const FINAL_URL = `${RAILWAY_URL}?t=${Date.now()}`;

    console.log("🚀 Enviando a Railway:", { user_id: FINAL_USER_ID, session_id: sessionId });

    const response = await fetch(FINAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    console.log("✅ Railway Response:", JSON.stringify(data));

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