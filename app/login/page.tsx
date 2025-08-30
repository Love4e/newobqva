"use client";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <button
        onClick={signInWithGoogle}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-semibold"
      >
        Вход с Google
      </button>
    </main>
  );
}
