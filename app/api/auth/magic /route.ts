// app/api/auth/magic/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: any, status = 200) =>
  new NextResponse(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

// Разреши preflight (ако браузърът праща OPTIONS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST,OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

// За дебъг – ако случайно идва GET, да видим че е GET (без 405)
export async function GET() {
  return json({ error: "Use POST", hint: "You called GET" }, 405);
}

export async function POST(req: Request) {
  try {
    console.log("[/api/auth/magic] method:", req.method);

    const { email } = await req.json().catch(() => ({}));
    if (!email || typeof email !== "string") {
      return json({ error: "Missing or invalid email" }, 400);
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return json({ error: "Supabase env vars missing" }, 500);
    }

    const SITE_URL =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: `${SITE_URL}/auth/callback` },
    });

    if (error) return json({ error: error.message }, 400);

    return json({ ok: true });
  } catch (e: any) {
    console.error("[/api/auth/magic] server error:", e);
    return json({ error: e?.message || "Unknown error" }, 500);
  }
}
