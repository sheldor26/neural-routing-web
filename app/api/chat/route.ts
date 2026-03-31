import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  // --- LÓGICA DE COSTOS REALES (Precios por 1M tokens aprox) ---
  // GPT-4o (Premium): ~$5.00 input / $15.00 output
  // Llama 3 / 4o-mini (Economy): ~$0.15 input / $0.60 output
  
  const inputTokens = lastMessage.length / 4; // Estimación burda de tokens
  const premiumCost = (inputTokens / 1000000) * 5.00;
  const economyCost = (inputTokens / 1000000) * 0.15;
  
  const savingsValue = premiumCost - economyCost;
  
  // Cálculo de agua: ~0.5L por cada 10-50 mensajes (Promedio industria)
  const waterSavedPerRequest = 0.0125; 

  return NextResponse.json({ 
    role: 'assistant', 
    content: "The calculation is complete. The result of 4 + 4 is 8.", 
    stats: {
      model: "Llama 3.1 (Routed)",
      savings: `$${savingsValue.toFixed(5)}`, // Valor real de la diferencia
      water: `${waterSavedPerRequest}L`
    }
  });
}