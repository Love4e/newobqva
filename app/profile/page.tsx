import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export default async function ProfilePage(){
  const supa = createServerComponentClient({ cookies })
  const { data: { user } } = await supa.auth.getUser()

  if (!user) {
    return (
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold">Профил</h1>
        <p className="mt-2">Не сте влезли.</p>
        <a className="btn mt-3 inline-block" href="/login">Вход</a>
      </main>
    )
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Моят профил</h1>
      <div className="card p-4">
        <div><b>Имейл:</b> {user.email}</div>
        <div><b>Име:</b> {profile?.name ?? '—'}</div>
        <div><b>Телефон:</b> {profile?.phone ?? '—'}</div>
        <div><b>Абонамент до:</b> {profile?.subscription_until ? new Date(profile.subscription_until).toLocaleString() : '—'}</div>
        <a className="btn mt-3 inline-block" href="/post">Пусни обява</a>
      </div>
    </main>
  )
}
