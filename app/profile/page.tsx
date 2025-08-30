"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    location.href = "/login";
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Профил</h1>
        <p>{email ? `Влязъл си като: ${email}` : "Няма активна сесия."}</p>
        <button onClick={signOut} className="bg-gray-800 text-white px-4 py-2 rounded">
          Изход
        </button>
      </div>
    </main>
  );
}
