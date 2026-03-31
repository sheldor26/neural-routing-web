import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Receive data from the React component
    const { messages, userId, sessionId } = await req.json();

    const RAILWAY_URL = "https://web-production-4f439.up.railway.app/v1/dispatch";
    // Cache busting timestamp to ensure fresh neural routing
    const FINAL_URL = `${RAILWAY_URL}?t=${Date.now()}`;

    // 2. Uplink to Railway Neural Node
    const response = await fetch(FINAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'key_demo_user', 
      },
      body: JSON.stringify({
        messages: messages, 
        user_id: userId || "guest_user",
        session_id: sessionId || "default_session" 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Railway Node Error Detail:", errorData);
      throw new Error(errorData.detail || `Neural Error: ${response.status}`);
    }

    const data = await response.json();

    // 3. Formatted Response for the Frontend
    // We now include 'suggested_title' which comes from your Python AI logic
    return NextResponse.json({
      role: 'assistant',
      content: data.output?.ai_answer || data.content,
      suggested_title: data.suggested_title || null, // Capture the AI's title suggestion
      routing: {
        model_used: data.routing?.model_used || "Neural Node",
        tier: data.routing?.tier || "Standard"
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