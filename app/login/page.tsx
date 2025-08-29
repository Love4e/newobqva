"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");

  // Тест: логваме в конзолата URL-а
  console.log("NEXT_PUBLIC_SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL);

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        alert("Supabase error: " + error.message);
      } else {
        alert("Изпратихме ти имейл за вход!");
      }
    } catch (err: any) {
      alert("Грешка: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Вход</h1>
      <input
        type="email"
        placeholder="Твоят имейл"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2 mb-4 rounded w-80"
      />
      <button
        onClick={handleLogin}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Изпрати линк за вход
      </button>
    </div>
  );
}
