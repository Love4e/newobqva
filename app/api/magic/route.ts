// app/api/magic/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function json(body: any, status: number = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// CORS preflight
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

// GET fallback – /api/magic?email=...
export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get("email");
  if (!email) return json({ error: "Missing email" }, 400);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
  });

  if (error) return json({ error: error.message }, 400);
  return json({ ok: true });
}

// POST – { email: "..." }
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return json({ error: "Missing or invalid email" }, 400);
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
    });

    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  } catch (err: any) {
    return json({ error: err.message ?? "Unknown error" }, 500);
  }
}
