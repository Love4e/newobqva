"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfileClient({ initialPhone }: { initialPhone: string | null }) {
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function savePhone() {
    setSaving(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { phone },
      });
      if (error) throw error;
      setMsg("Телефонът е запазен успешно.");
    } catch (e: any) {
      setMsg(e?.message ?? "Грешка при запазването.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="mb-3 text-sm font-semibold text-slate-800">Телефон</h4>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
          placeholder="+359 88 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          onClick={savePhone}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "Запазване…" : "Запази"}
        </button>
      </div>
      {msg && <p className="mt-2 text-sm text-slate-600">{msg}</p>}
    </div>
  );
}
