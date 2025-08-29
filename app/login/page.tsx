'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
    setLoading(true)
    try {
      const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      })
      if (error) setStatus(`Supabase error: ${error.message}`)
      else setStatus('OK: изпратихме линк за вход (провери пощата/Спам)')
    } catch (err: any) {
      setStatus(`Client error: ${err?.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Вход</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="имейл"
          className="w-full rounded border px-3 py-2"
        />
        <button type="submit" disabled={loading}
          className="rounded bg-indigo-600 text-white px-4 py-2 disabled:opacity-50">
          {loading ? 'Изпращаме…' : 'Изпрати линк за вход'}
        </button>
      </form>

      {status && <p className="mt-4 font-mono text-sm">{status}</p>}

      <div className="mt-6 text-xs opacity-70">
        NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING'}<br/>
        NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'OK' : 'MISSING'}<br/>
        NEXT_PUBLIC_SITE_URL: {process.env.NEXT_PUBLIC_SITE_URL || '(missing)'}
      </div>
    </div>
  )
}
