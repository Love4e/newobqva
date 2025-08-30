// app/login/page.tsx
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // важно: да не прави GET submit
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/auth/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // не предполагаме винаги JSON
      const ct = res.headers.get("content-type") || "";
      let data: any = null;
      if (ct.includes("application/json")) {
        data = await res.json().catch(() => null);
      } else {
        const text = await res.text().catch(() => "");
        data = text ? { message: text } : null;
      }

      if (!res.ok) {
        const err = (data && (data.error || data.message)) || `HTTP ${res.status}`;
        setMsg("Грешка: " + err);
      } else {
        setMsg("Изпратихме линк за вход на " + email);
      }
    } catch (err: any) {
      setMsg("Fetch грешка: " + (err?.message || "неизвестна"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "60px auto", textAlign: "center" }}>
      <h1 style={{ marginBottom: 20 }}>Вход</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          required
          placeholder="email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            border: "1px solid #d1d5db",
            marginBottom: 12,
            background: "#eef2ff",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            background: "#5446f5",
            color: "white",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? "Изпращаме..." : "Изпрати линк за вход"}
        </button>
      </form>

      {msg && (
        <p style={{ marginTop: 14, color: msg.startsWith("Грешка") ? "#b91c1c" : "#111827" }}>
          {msg}
        </p>
      )}
    </main>
  );
}
