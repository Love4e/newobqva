"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

export default function CallbackClient() {
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
