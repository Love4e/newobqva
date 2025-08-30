"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: redirectTo },
    });

    setLoading(false);
    if (error) setMsg("Грешка: " + error.message);
    else setMsg("Изпратихме линк за вход на " + email);
  }

  return (
    <form onSubmit={sendMagicLink} style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Вход</h1>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@domain.com"
        style={{ width: "100%", padding: 14, borderRadius: 10, marginBottom: 12 }}
      />
      <button
        disabled={loading}
        style={{ padding: "12px 18px", borderRadius: 10, background: "#4f46e5", color: "#fff" }}
      >
        {loading ? "Изпращаме..." : "Изпрати линк за вход"}
      </button>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </form>
  );
}
