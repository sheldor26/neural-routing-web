import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server'; // Correct import for Route Handlers

export async function POST(req: Request) {
  try {
    // 1. Get Clerk session correctly
    const { userId } = getAuth(req as any);
    
    // 2. Validate Body
    const body = await req.json();
    
    // 3. Configuration
    const apiKey = process.env.NR_PRIVATE_KEY || 'nr-dev-secret-123'; 
    const RAILWAY_ENDPOINT = 'https://web-production-4f439.up.railway.app/v1/dispatch';

    // 4. Call Railway
    const response = await fetch(RAILWAY_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey
      },
      body: JSON.stringify({
        ...body,
        // Use real Clerk ID or fallback to the dev ID found in your Supabase screenshot
        user_id: userId || "juan_dev_34" 
      }),
      cache: 'no-store'
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ 
        error: "Backend Error", 
        details: data 
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Proxy Crash:", error.message);
    return NextResponse.json({ 
      error: "Proxy internal failure", 
      details: error.message 
    }, { status: 500 });
  }
}
