'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export default function AuthCallback() {
  const params = useSearchParams()
  const router = useRouter()
  const [msg, setMsg] = useState('Завършваме входа…')

  useEffect(() => {
    (async () => {
      const token_hash = params.get('token_hash')
      const type = params.get('type') // 'signup' | 'magiclink' | 'recovery'…
      if (!token_hash) {
        setMsg('Липсва token_hash в URL.')
        return
      }
      const { data, error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })
      if (error) {
        setMsg(`Грешка при потвърждение: ${error.message}`)
        return
      }
      setMsg('Успешен вход! Пренасочваме…')
      setTimeout(() => router.push('/'), 800)
    })()
  }, [params, router])

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Auth Callback</h1>
      <p className="font-mono">{msg}</p>
    </div>
  )
}
