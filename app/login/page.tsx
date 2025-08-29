'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function LoginPage() {
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function sendLink(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
    if (error) return alert(error.message)
    setSent(true)
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Вход</h1>
      {sent ? (
        <p className="mt-3">Изпратихме линк за вход на <b>{email}</b>.</p>
      ) : (
        <form onSubmit={sendLink} className="mt-4 space-y-3">
          <input
            className="w-full border rounded-lg p-2"
            type="email"
            placeholder="имейл"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />
          <button className="btn">Изпрати линк за вход</button>
        </form>
      )}
    </main>
  )
}
