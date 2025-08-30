"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const err = params.get("err");

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          // (по желание) подсказваме на Google да поиска refresh permissions
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  const errorMessage =
    err === "only_gmail"
      ? "Разрешен е вход само с Gmail акаунт."
      : err === "missing_code"
      ? "Липсва код за удостоверяване. Опитай отново."
      : err
      ? decodeURIComponent(err)
      : null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Вход</h1>

        {errorMessage && (
          <p className="text-center text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full rounded-lg bg-red-600 hover:bg-red-700 text-white py-3 font-semibold disabled:opacity-50"
        >
          {loading ? "Пренасочване…" : "Вход с Google"}
        </button>

        <p className="text-xs text-center text-gray-500">
          Ще разрешим достъп само на адреси, завършващи на <b>@gmail.com</b>.
        </p>
      </div>
    </main>
  );
}
