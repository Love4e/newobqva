"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Обработва се входът…");
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        // Supabase връща ?code=... и/или ?access_token=...
        const code = params.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }
        // Успешно: към /profile (или /)
        router.replace("/profile");
      } catch (e: any) {
        console.error(e);
        setMessage(e?.message || "Грешка при обмен на код за сесия.");
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-slate-700">{message}</p>
    </div>
  );
}
