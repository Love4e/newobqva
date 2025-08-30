// app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Проверяваме връзката...");

  useEffect(() => {
    const run = async () => {
      const errorDesc = searchParams.get("error_description");
      if (errorDesc) {
        setStatus("error");
        setMessage("Грешка: " + decodeURIComponent(errorDesc));
        return;
      }

      const code = searchParams.get("code");
      if (!code) {
        setStatus("error");
        setMessage("Липсва параметър 'code' в URL.");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setStatus("error");
        setMessage("Грешка при входа: " + error.message);
        return;
      }

      setStatus("ok");
      setMessage("Успешно влизане! Пренасочваме…");

      // сменете /profile с желаната защитена страница
      router.replace("/profile");
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      style={{
        maxWidth: 680,
        margin: "80px auto",
        textAlign: "center",
        padding: "24px",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <h1 style={{ marginBottom: 12 }}>
        {status === "loading" ? "Обработваме входа…" : status === "ok" ? "Готово" : "Възникна проблем"}
      </h1>
      <p>{message}</p>
      {status === "error" && (
        <button
          onClick={() => router.push("/")}
          style={{
            marginTop: 18,
            padding: "10px 16px",
            borderRadius: 10,
            background: "#4f46e5",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Към началната страница
        </button>
      )}
    </main>
  );
}
