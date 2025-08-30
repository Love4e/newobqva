import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const json = (body: any, status = 200) =>
  new NextResponse(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST,GET,OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get("email");
  if (!email) return json({ error: "Use POST with { email } or GET ?email=" }, 400);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
  });

  return error ? json({ error: error.message }, 400) : json({ ok: true });
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email || typeof email !== "string") return json({ error: "Missing or invalid email" }, 400);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
    });

    return error ? json({ error: error.message }, 400) : json({ ok: true });
  } catch (e: any) {
    return json({ error: e?.message || "Unknown error" }, 500);
  }
}
