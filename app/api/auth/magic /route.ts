// app/api/auth/magic/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    console.log("➡️ Получен email:", email);

    if (!email) {
      console.error("❌ Email not provided");
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const SITE_URL =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    console.log("ENV check:", {
      SUPABASE_URL,
      HAS_KEY: !!SUPABASE_ANON_KEY,
      SITE_URL,
    });

    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error("❌ Supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("✅ Magic link изпратен на:", email);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("❌ Server error:", e);
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
