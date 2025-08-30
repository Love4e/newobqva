"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/auth/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

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
      <h1>Вход</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@domain.com"
          style={{ width: "100%", padding: 12, borderRadius: 10, marginBottom: 12 }}
        />
        <button
          disabled={loading}
          style={{ width: "100%", padding: 12, borderRadius: 10, background: "#4f46e5", color: "#fff" }}
        >
          {loading ? "Изпращаме..." : "Изпрати линк за вход"}
        </button>
      </form>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </main>
  );
}
