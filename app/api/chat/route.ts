import { NextResponse } from 'next/server';
import { API_BASE } from '@/lib/config';

const RAILWAY_URL = `${API_BASE}/v1/dispatch`;

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();

    const FINAL_USER_ID = "juan_dev_34";

    // Cache busting para asegurar ruteo fresco
    const FINAL_URL = `${RAILWAY_URL}?t=${Date.now()}`;

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
      throw new Error(errorData.detail || `Neural Error: ${response.status}`);
    }

    const data = await response.json();

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
    return NextResponse.json({
      role: 'assistant',
      content: `System Error: ${error.message}. Ensure Railway infrastructure is online.`
    }, { status: 500 });
  }
}
