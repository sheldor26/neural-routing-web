/**
 * GET /api/checkout?plan=starter|growth|business&user_id=CLERK_ID
 *
 * Builds a Lemon Squeezy checkout URL with the user_id embedded as
 * custom data, then redirects. This way the LS webhook can identify
 * which Clerk user made the purchase without fragile email matching.
 *
 * Required env vars (set in Vercel):
 *   LS_STORE_SLUG         — your LS store slug (e.g. "neuralrouting")
 *   LS_VARIANT_STARTER    — variant ID for Starter plan
 *   LS_VARIANT_GROWTH     — variant ID for Growth plan
 *   LS_VARIANT_BUSINESS   — variant ID for Business plan
 */

import { NextRequest, NextResponse } from "next/server";

const VARIANT_MAP: Record<string, string | undefined> = {
  starter:  process.env.LS_VARIANT_STARTER,
  growth:   process.env.LS_VARIANT_GROWTH,
  business: process.env.LS_VARIANT_BUSINESS,
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const plan    = searchParams.get("plan")    || "";
  const userId  = searchParams.get("user_id") || "";
  const email   = searchParams.get("email")   || "";

  const variantId = VARIANT_MAP[plan];

  if (!variantId) {
    return NextResponse.json(
      { error: `Unknown plan '${plan}'. Expected: starter | growth | business` },
      { status: 400 }
    );
  }

  // Build Lemon Squeezy checkout URL
  // Docs: https://docs.lemonsqueezy.com/help/checkout/passing-custom-data
  const url = new URL(`https://neuralroutingio.lemonsqueezy.com/buy/${variantId}`);

  // Pre-fill user email if available
  if (email) url.searchParams.set("checkout[email]", email);

  // Embed user_id as custom data — the LS webhook reads this as meta.custom_data.user_id
  if (userId) url.searchParams.set("checkout[custom][user_id]", userId);

  // Redirect after purchase
  url.searchParams.set("checkout[redirect_url]", `${req.nextUrl.origin}/dashboard?upgraded=1`);

  // Try direct variant URL first; if variants are still pending in LS,
  // fall back to the storefront so users can still purchase.
  return NextResponse.redirect(url.toString(), { status: 302 });
}
