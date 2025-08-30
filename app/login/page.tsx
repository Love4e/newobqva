"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      setMsg(`Изпратихме линк за вход на ${email}.`);
    } catch (err: any) {
      setMsg("Грешка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={sendMagicLink}
        className="w-full max-w-md bg-white p-6 rounded shadow space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Вход</h1>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@domain.com"
          className="w-full border rounded px-3 py-2 bg-blue-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-600 text-white py-3 font-semibold disabled:opacity-50"
        >
          {loading ? "Изпращане..." : "Изпрати линк за вход"}
        </button>
        {msg && <p className="text-center text-sm">{msg}</p>}
      </form>
    </main>
  );
}
