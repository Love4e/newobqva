"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const errorParam =
        params.get("error_description") || params.get("error") || undefined;
      if (errorParam) {
        router.replace("/login?err=" + encodeURIComponent(errorParam));
        return;
      }

      const code = params.get("code");
      if (!code) {
        router.replace("/login?err=missing_code");
        return;
      }

      // 1) Разменяме "code" за сесия
      const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(
        code
      );
      if (exchangeErr) {
        router.replace(
          "/login?err=" + encodeURIComponent(exchangeErr.message)
        );
        return;
      }

      // 2) Взимаме потребителя и проверяваме домейна
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const email = user?.email ?? "";
      if (!email.endsWith("@gmail.com")) {
        // Не е Gmail → излизаме и връщаме към login със съобщение
        await supabase.auth.signOut();
        router.replace("/login?err=only_gmail");
        return;
      }

      // 3) Успех → пренасочване към началото (или където искаш)
      router.replace("/");
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Влизане…</p>
    </main>
  );
}
