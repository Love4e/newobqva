"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      setMessage("Изпратихме линк за вход на имейла ти.");
    } catch (err: any) {
      setError(`Грешка: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow rounded p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Вход</h1>
        <form onSubmit={sendMagicLink} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Имейл адрес"
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-blue-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Изпращане..." : "Изпрати линк за вход"}
          </button>
        </form>

        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
}
