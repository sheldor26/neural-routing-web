import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Use 127.0.0.1 instead of localhost to avoid IPv6 resolution issues on some systems
    // Ensure there is NO trailing slash at the end of 'dispatch'
    const PYTHON_GATEWAY_URL = 'http://127.0.0.1:8000/v1/dispatch';

    const response = await fetch(PYTHON_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'key_demo_user', // Matches your CLIENT_KEYS in main.py
      },
      body: JSON.stringify({
        prompt: lastMessage,
        user_id: userId || "guest_user"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // If FastAPI returns an error, we catch it here
      throw new Error(errorData.detail || `Gateway Error: ${response.status}`);
    }

    const data = await response.json();

    // Map the Python response structure to the Chat UI structure
    return NextResponse.json({
      role: 'assistant',
      content: data.output.ai_answer,
      stats: {
        model: data.routing.model_used,
        savings: `${data.business_metrics.estimated_savings_usd}`,
        water: "0.0125L" 
      }
    });

  } catch (error: any) {
    console.error("Neural Link Failure:", error.message);
    
    return NextResponse.json({ 
      role: 'assistant', 
      content: `System Error: ${error.message}. Please verify main.py is active on port 8000.` 
    }, { status: 500 });
  }
}