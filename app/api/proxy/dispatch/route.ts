import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req as any);
    const body = await req.json();
    
    // Ensure you have NR_PRIVATE_KEY in your project variables
    const apiKey = process.env.NR_PRIVATE_KEY || 'nr-dev-secret-123'; 
    const RAILWAY_ENDPOINT = 'https://web-production-4f439.up.railway.app/v1/dispatch';

    const response = await fetch(RAILWAY_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey
      },
      body: JSON.stringify({
        ...body,
        // If Clerk is not fully synced, we use the juan_dev_34 credits
        user_id: body.user_id || userId || "juan_dev_34" 
      }),
      cache: 'no-store'
    });

    if (response.status === 402) {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: 402 });
    }

    const data = await response.json();
    if (!response.ok) return NextResponse.json(data, { status: response.status });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Proxy Failure", details: error.message }, { status: 500 });
  }
}
