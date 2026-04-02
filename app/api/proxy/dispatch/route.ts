import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Ensure we use the Environment Variable in production
    const apiKey = process.env.NR_PRIVATE_KEY || 'nr-dev-secret-123';

    // The Railway URL must be exactly as defined in your dashboard
    const RAILWAY_ENDPOINT = 'https://web-production-4f439.up.railway.app/v1/dispatch';

    const response = await fetch(RAILWAY_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
        // Optional: Some backends require a User-Agent or specific Origin
        'User-Agent': 'NeuralRouting-Proxy/1.0'
      },
      body: JSON.stringify({
        ...body,
        // Ensure user_id is present if the backend requires it for stats
        user_id: body.user_id || 'anonymous_node'
      }),
      // Set a cache policy for Next.js 14+
      cache: 'no-store'
    });

    // Capture 401, 404, or 500 from Railway
    if (!response.ok) {
        const errorData = await response.text();
        console.error(`Backend Response Error [${response.status}]:`, errorData);
        
        return NextResponse.json({ 
            error: "Backend communication failed", 
            status: response.status,
            details: errorData 
        }, { status: response.status });
    }

    const data = await response.json();
    
    // Return the data directly to the Dashboard
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Critical Proxy Error:", error);
    
    return NextResponse.json({ 
        error: "Proxy connection timeout or failure", 
        details: error.message 
    }, { status: 500 });
  }
}