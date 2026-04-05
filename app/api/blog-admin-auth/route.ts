import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user, pass } = await req.json();

  const validUser = process.env.BLOG_ADMIN_USER;
  const validPass = process.env.BLOG_ADMIN_PASS;

  if (!validUser || !validPass) {
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
  }

  if (user === validUser && pass === validPass) {
    return NextResponse.json({ ok: true });
  }

  // Delay response slightly to slow brute-force
  await new Promise((r) => setTimeout(r, 600));
  return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
}
