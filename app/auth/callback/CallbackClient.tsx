"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

export default function CallbackClient() {
  const router = useRouter();
  const [txt, setTxt] = useState("Проверяваме връзката...");

  useEffect(() => {
    (async () => {
      try {
        // Вземаме кода директно от window.location, без useSearchParams()
        const params = new URLSearchParams(window.location.search);
        const errorDesc = params.get("error_description");
        if (errorDesc) {
          setTxt("Грешка: " + decodeURIComponent(errorDesc));
          return;
        }

        const code = params.get("code");
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
      } catch (e: any) {
        setTxt("Грешка: " + (e?.message || "неизвестна"));
      }
    })();
  }, [router]);

  return (
    <main style={{ maxWidth: 680, margin: "80px auto", textAlign: "center" }}>
      <h1>{txt}</h1>
    </main>
  );
}
