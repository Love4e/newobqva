"use client";

import { useState } from "react";

export default function LoginForm() {
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

      const data = await res.json();

      if (!res.ok) {
        setMsg("Грешка: " + (data.error || "Неуспешна заявка"));
      } else {
        setMsg("Изпратихме линк за вход на " + email);
      }
    } catch (err: any) {
      setMsg("Fetch грешка: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: "60px auto" }}>
      <h2 style={{ marginBottom: 20 }}>Вход</h2>

      <input
        type="email"
        placeholder="Въведи имейл"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          background: "#4f46e5",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {loading ? "Изпращаме..." : "Изпрати линк за вход"}
      </button>

      {msg && <p style={{ marginTop: 14 }}>{msg}</p>}
    </form>
  );
}
