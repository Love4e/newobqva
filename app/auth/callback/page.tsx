// app/auth/callback/page.tsx
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
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Проверяваме връзката...");

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get("code");
      if (!code) {
        setStatus("Липсва код за вход.");
        return;
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error(error);
        setStatus("Грешка при входа: " + error.message);
        return;
      }

      // Успешен вход → може да редиректнеш към табло, профил и т.н.
      setStatus("Успешно влизане! Пренасочваме...");
      setTimeout(() => {
        router.push("/profile"); // смени с твоята страница
      }, 1500);
    }

    handleCallback();
  }, [searchParams, router]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>{status}</h1>
    </div>
  );
}
