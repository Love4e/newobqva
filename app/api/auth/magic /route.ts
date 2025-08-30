import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: any, status = 200) =>
  new NextResponse(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

function getEnv() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return { SUPABASE_URL, SUPABASE_ANON_KEY, SITE_URL };
}

async function sendMagicLink(email: string) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, SITE_URL } = getEnv();
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: "Supabase env vars missing" };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: `${SITE_URL}/auth/callback` },
  });

  if (error) return { error: error.message };
  return { ok: true };
}

// --- OPTIONS (preflight) ---
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

// --- GET (резервен режим: /api/auth/magic?email=...) ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return json({ error: "Use POST with { email } or GET ?email=" }, 400);

  const result = await sendMagicLink(email);
  return result.error ? json({ error: result.error }, 400) : json({ ok: true });
}

// --- POST (основният път) ---
export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email || typeof email !== "string") return json({ error: "Missing or invalid email" }, 400);

    const result = await sendMagicLink(email);
    return result.error ? json({ error: result.error }, 400) : json({ ok: true });
  } catch (e: any) {
    return json({ error: e?.message || "Unknown error" }, 500);
  }
}
