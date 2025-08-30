"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // Важно: redirect към нашия /auth/callback
      const redirectTo = `${siteUrl.replace(/\/$/, "")}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            // Рядко е нужно, но дава refresh_token по-лесно
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
      // НИЩО ДРУГО ТУК – Supabase ще редиректне към Google.
    } catch (e: any) {
      alert(e.message || "Нещо се обърка при входа с Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">Вход</h1>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          <svg width="22" height="22" viewBox="0 0 48 48" className="shrink-0">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
            s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.64,6.053,29.045,4,24,4C12.955,4,4,12.955,4,24
            s8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.597,16.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
            C33.64,6.053,29.045,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.176,0,9.859-1.977,13.409-5.197l-6.19-5.238C29.211,35.091,26.739,36,24,36
            c-5.194,0-9.607-3.317-11.279-7.946l-6.524,5.024C9.51,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.79,2.231-2.231,4.146-4.094,5.565
            c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          {loading ? "Пренасочване към Google…" : "Влез с Google"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Входът по имейл (magic link) е изключен.
        </p>
      </div>
    </div>
  );
}
