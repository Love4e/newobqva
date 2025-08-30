"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const code = params.get("code");
      if (!code) {
        router.replace("/login?err=missing_code");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        router.replace("/login?err=" + encodeURIComponent(error.message));
        return;
      }

      // взимаме user-а
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email ?? "";

      if (!email.endsWith("@gmail.com")) {
        await supabase.auth.signOut();
        router.replace("/login?err=only_gmail");
        return;
      }

      // ако е Gmail → пускаме към началото
      router.replace("/");
    };
    run();
  }, [params, router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Влизане...</p>
    </div>
  );
}
