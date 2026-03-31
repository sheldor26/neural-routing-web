import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Llamamos a tu FastAPI en el puerto 8000
    const response = await fetch('http://127.0.0.1:8000/v1/dispatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'key_demo_user' // Usamos una de las llaves que definiste en CLIENT_KEYS
      },
      body: JSON.stringify({
        prompt: lastMessage,
        user_id: userId || "guest_user"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Neural Gateway Error");
    }

    const data = await response.json();

    // Formateamos la salida de tu main.py para que el chat la entienda
    return NextResponse.json({
      role: 'assistant',
      content: data.output.ai_answer,
      stats: {
        model: data.routing.model_used,
        savings: `$${data.business_metrics.estimated_savings_usd}`,
        water: "0.0125L" // Este lo podemos dejar fijo o calcularlo luego
      }
    });

  } catch (error: any) {
    console.error("Gateway Connection Failed:", error);
    return NextResponse.json({ 
      role: 'assistant', 
      content: "Neural Gateway is offline. Check if main.py is running on port 8000." 
    }, { status: 500 });
  }
}