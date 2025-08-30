// app/auth/callback/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

// кажи на Next да не пререндерира статично тази страница
export const dynamic = "force-dynamic";
export const revalidate = 0;

function CallbackInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [txt, setTxt] = useState("Проверяваме връзката...");

  useEffect(() => {
    (async () => {
      const errorDesc = sp.get("error_description");
      if (errorDesc) {
        setTxt("Грешка: " + decodeURIComponent(errorDesc));
        return;
      }
      const code = sp.get("code");
      if (!code) {
        setTxt("Липсва параметър 'code' в URL.");
        return;
      }
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setTxt("Грешка при входа: " + error.message);
        return;
      }
      setTxt("Успешно влизане! Пренасочваме…");
      router.replace("/profile");
    })();
  }, [sp, router]);

  return (
    <main style={{ maxWidth: 680, margin: "80px auto", textAlign: "center" }}>
      <h1>{txt}</h1>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <main style={{ maxWidth: 680, margin: "80px auto", textAlign: "center" }}>
        <h1>Зареждане…</h1>
      </main>
    }>
      <CallbackInner />
    </Suspense>
  );
}
