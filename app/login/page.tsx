"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sendMagicLink = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Нещо се обърка");
      }

      setMessage("Изпратихме ти линк за вход на " + email);
    } catch (err: any) {
      setMessage("Грешка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-lg mb-4">Вход</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Твоят имейл"
        className="border px-4 py-2 rounded w-80 mb-4"
      />
      <button
        onClick={sendMagicLink}
        disabled={loading}
        className="bg-indigo-600 text-white px-6 py-2 rounded w-80"
      >
        {loading ? "Изпращане..." : "Изпрати линк за вход"}
      </button>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
