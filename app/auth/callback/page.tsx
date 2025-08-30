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
  const [status, setStatus] = useState("Зареждане...");

  useEffect(() => {
    const verify = async () => {
      const code = searchParams.get("code");

      if (!code) {
        setStatus("Невалиден линк за вход.");
        return;
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error(error);
        setStatus("Грешка при вход: " + error.message);
        return;
      }

      setStatus("Успешен вход! Пренасочване...");
      router.replace("/profile");
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <p>{status}</p>
    </div>
  );
}
