/**
 * GET /api/checkout?plan=starter|growth|business&user_id=CLERK_ID&email=EMAIL
 *
 * Creates a Lemon Squeezy checkout session via API and redirects to the
 * returned checkout URL. This is the correct approach per LS docs:
 * https://docs.lemonsqueezy.com/api/checkouts/create-checkout
 *
 * Required env vars (Vercel):
 *   LS_API_KEY          — Lemon Squeezy API key
 *   LS_STORE_ID         — Store ID (331554)
 *   LS_VARIANT_STARTER  — Variant ID for Starter plan
 *   LS_VARIANT_GROWTH   — Variant ID for Growth plan
 *   LS_VARIANT_BUSINESS — Variant ID for Business plan
 */

import { NextRequest, NextResponse } from "next/server";

const VARIANT_MAP: Record<string, string | undefined> = {
  starter:  process.env.LS_VARIANT_STARTER,
  growth:   process.env.LS_VARIANT_GROWTH,
  business: process.env.LS_VARIANT_BUSINESS,
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const plan   = searchParams.get("plan")    || "";
  const userId = searchParams.get("user_id") || "";
  const email  = searchParams.get("email")   || "";

  const variantId = VARIANT_MAP[plan];
  if (!variantId) {
    return NextResponse.json({ error: `Unknown plan: ${plan}` }, { status: 400 });
  }

  const apiKey  = process.env.LS_API_KEY;
  const storeId = process.env.LS_STORE_ID || "331554";

  if (!apiKey) {
    return NextResponse.json({ error: "LS_API_KEY not configured" }, { status: 500 });
  }

  try {
    const body = {
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            redirect_url: "https://neuralrouting.io/dashboard?upgraded=1",
          },
          checkout_data: {
            ...(email   ? { email }                         : {}),
            ...(userId  ? { custom: { user_id: userId } }  : {}),
          },
        },
        relationships: {
          store:   { data: { type: "stores",   id: storeId   } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    };

    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method:  "POST",
      headers: {
        "Accept":       "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[LS Checkout] API error:", err);
      return NextResponse.redirect("https://neuralroutingio.lemonsqueezy.com");
    }

    const data = await res.json();
    const checkoutUrl = data?.data?.attributes?.url;

    if (!checkoutUrl) {
      return NextResponse.redirect("https://neuralroutingio.lemonsqueezy.com");
    }

    return NextResponse.redirect(checkoutUrl);

  } catch (err) {
    console.error("[LS Checkout] Unexpected error:", err);
    return NextResponse.redirect("https://neuralroutingio.lemonsqueezy.com");
  }
}
