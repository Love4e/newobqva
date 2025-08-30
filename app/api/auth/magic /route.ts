import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Създаваме Supabase клиент
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // Изпращаме magic link чрез Supabase
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // URL за callback след клик на линка от имейла
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// За да не връща 405 на GET заявки
export async function GET() {
  return NextResponse.json({ message: "Magic link endpoint" });
}
