'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

// Забраняваме пререндер (иначе Next ще се опита да я изгради статично)
export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

function CallbackInner() {
  const params = useSearchParams()
  const router = useRouter()
  const [msg, setMsg] = useState('Завършваме входа…')

  useEffect(() => {
    (async () => {
      const token_hash = params.get('token_hash')
      // ако няма `type` -> ползваме 'magiclink'
      const type = (params.get('type') as
        | 'magiclink'
        | 'signup'
        | 'recovery'
        | 'invite'
        | 'email_change') ?? 'magiclink'

      if (!token_hash) {
        setMsg('Липсва token_hash в URL.')
        return
      }

      const { error } = await supabase.auth.verifyOtp({ token_hash, type })
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

export default function AuthCallbackPage() {
  // Важно: useSearchParams() е вътре в компонент, който е в Suspense
  return (
    <Suspense fallback={<div className="p-8">Зарежда…</div>}>
      <CallbackInner />
    </Suspense>
  )
}
