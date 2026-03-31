import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // --- CONFIGURACIÓN DE PRODUCCIÓN ---
    // Usamos la variable de entorno NEXT_PUBLIC_PYTHON_API_URL
    // Si no existe (en local), vuelve a 127.0.0.1:8000
    const BACKEND_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://127.0.0.1:8000';
    const PYTHON_GATEWAY_URL = `${BACKEND_URL}/v1/dispatch`;

    const response = await fetch(PYTHON_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'key_demo_user', 
      },
      body: JSON.stringify({
        prompt: lastMessage,
        user_id: userId || "guest_user"
      }),
    });

    if (!response.ok) {
      // Si el servidor de Python responde pero con error (ej: 403, 422)
      const errorData = await response.json();
      throw new Error(errorData.detail || `Gateway Error: ${response.status}`);
    }

    const data = await response.json();

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
    
    // Respuesta amigable para el usuario final en producción
    return NextResponse.json({ 
      role: 'assistant', 
      content: "Neural Node unreachable. Please ensure the backend gateway is active." 
    }, { status: 500 });
  }
}