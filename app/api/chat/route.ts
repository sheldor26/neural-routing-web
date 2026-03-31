import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();
    
    // Tomamos el último mensaje para el dispatch inmediato
    const lastMessage = messages[messages.length - 1].content;

    // Detectamos si estamos en producción o local para la URL del Playground
    const BACKEND_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://127.0.0.1:8000';
    
    // Limpiamos la URL para evitar problemas de dobles barras
    const cleanBaseUrl = BACKEND_URL.replace(/\/$/, "");
    const PYTHON_GATEWAY_URL = `${cleanBaseUrl}/v1/dispatch`;

    const response = await fetch(PYTHON_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'key_demo_user', 
      },
      body: JSON.stringify({
        prompt: lastMessage,
        user_id: userId || "guest_user" // Vital para el historial en Supabase
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Neural Node Error: ${response.status}`);
    }

    const data = await response.json();

    // Estructura compatible con el historial del Playground
    return NextResponse.json({
      role: 'assistant',
      content: data.output.ai_answer,
      stats: {
        model: data.routing.model_used,
        savings: `${data.business_metrics.estimated_savings_usd}`,
        water: data.business_metrics.water_conserved_l || "0.0125L" 
      }
    });

  } catch (error: any) {
    console.error("Neural Link Failure:", error.message);
    
    return NextResponse.json({ 
      role: 'assistant', 
      content: `Connection failed. Make sure your Python Neural Node is accessible at the configured URL.` 
    }, { status: 500 });
  }
}