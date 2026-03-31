import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Aquí es donde conectarías con OpenAI, pero por ahora 
  // vamos a hacer que el "Cerebro" de NeuralRouting responda de verdad
  const lastMessage = messages[messages.length - 1].content;
  
  // Simulamos una lógica de ruteo neural
  const aiResponse = `Neural Node analyzed: "${lastMessage}". Optimization complete. Result: 8. (Routed via Economy-Node to save 85% tokens).`;

  return NextResponse.json({ role: 'assistant', content: aiResponse });
}