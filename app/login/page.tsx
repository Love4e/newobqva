'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,        // трябва да е дефиниран във Vercel
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!    // също
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  async function sendLink(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      // За да изключим произволни разминавания, фиксираме redirect домейна:
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: 'https://newobqva.vercel.app' }
      })

      if (error) {
        alert(`Supabase error: ${error.message}`)
        return
      }
      alert('Изпратихме ти линк за вход. Провери пощата си.')
    } catch (err: any) {
      alert(`Network error: ${err?.message || err}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Вход</h1>
      <form onSubmit={sendLink} className="space-y-3">
        <input
          type="email"
          className="w-full border rounded-lg p-3"
          placeholder="имейл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          disabled={busy}
          className="bg-slate-900 text-white rounded-lg px-4 py-2 disabled:opacity-50"
        >
          Изпрати линк за вход
        </button>
      </form>

      {/* Диагностика – махни след като заработи */}
      <div className="mt-6 text-xs text-slate-500 break-all">
        <div><b>NEXT_PUBLIC_SUPABASE_URL:</b> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING'}</div>
        <div><b>NEXT_PUBLIC_SUPABASE_ANON_KEY:</b> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'OK' : 'MISSING'}</div>
      </div>
    </main>
  )
}
