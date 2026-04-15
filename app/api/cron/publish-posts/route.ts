import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Vercel Cron calls this endpoint daily at 10:00 UTC.
// It publishes any post where published_at <= now() and published = false.
export async function GET(req: NextRequest) {
  // Verify the request is from Vercel Cron (or manual trigger with secret)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("posts")
    .update({ published: true })
    .eq("published", false)
    .lte("published_at", now)
    .select("id, slug, title, published_at");

  if (error) {
    console.error("[cron/publish-posts] Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const count = data?.length ?? 0;
  console.log(`[cron/publish-posts] Published ${count} post(s):`, data?.map(p => p.slug));

  return NextResponse.json({
    ok: true,
    published: count,
    posts: data?.map(p => ({ slug: p.slug, title: p.title, scheduled: p.published_at })),
  });
}
