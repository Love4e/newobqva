"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallbackPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [status, setStatus] = useState("Зареждане...");

  useEffect(() => {
    const run = async () => {
      const code = search.get("code");
      if (!code) return setStatus("Невалиден линк.");

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) return setStatus("Грешка: " + error.message);

      setStatus("Успешен вход! Пренасочване...");
      router.replace("/profile");
    };
    run();
  }, [search, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>{status}</p>
    </main>
  );
}
