'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const res = await fetch('/api/auth/magic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg(json?.error || res.statusText || 'Грешка при изпращане')
        return
      }
      setMsg('Изпратихме ти линк за вход. Провери пощата си (погледни и Spam).')
      setEmail('')
    } catch (err: any) {
      setMsg(err?.message || 'Мрежова грешка')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Вход</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full border rounded-lg p-3"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          disabled={busy}
          className="bg-indigo-600 text-white rounded-lg px-4 py-2 disabled:opacity-50"
        >
          {busy ? 'Изпращаме…' : 'Изпрати линк за вход'}
        </button>
      </form>

      {msg && <p className="mt-4 text-sm text-slate-600">{msg}</p>}

      {/* Диагностика – може да се махне след като всичко заработи */}
      <div className="mt-6 text-xs text-slate-500 space-y-1">
        <div><b>NEXT_PUBLIC_SUPABASE_URL:</b> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING'}</div>
        <div><b>NEXT_PUBLIC_SUPABASE_ANON_KEY:</b> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'OK' : 'MISSING'}</div>
        <div><b>NEXT_PUBLIC_SITE_URL:</b> {process.env.NEXT_PUBLIC_SITE_URL || 'MISSING'}</div>
      </div>
    </main>
  )
}
