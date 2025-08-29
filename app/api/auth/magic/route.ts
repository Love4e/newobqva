// app/api/auth/magic/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ⚠️ По-добре използвай НЕ-public env ключове на сървъра:
// Във Vercel добави:
//  SUPABASE_URL            = https://...supabase.co
//  SUPABASE_ANON_KEY       = eyJhbGciOi...
const supabase = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // фиксираме redirect домейна, за да няма разминаване
        emailRedirectTo: 'https://newobqva.vercel.app',
      },
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
