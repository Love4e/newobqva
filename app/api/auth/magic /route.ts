// app/api/auth/magic/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Ако искаш, можеш да го оставиш на Node runtime (по-тих за debug)
// export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function env(name: string) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

export async function GET() {
  // Health check – отваряш /api/auth/magic в браузъра и виждаш стойностите
  return NextResponse.json({
    ok: true,
    route: '/api/auth/magic',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? '(missing)',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : '(missing)',
  })
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({} as any))
    if (!email) {
      return NextResponse.json(
        { ok: false, error: 'Missing "email" in JSON body' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      env('NEXT_PUBLIC_SUPABASE_URL'),
      env('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    )

    const redirectTo = `${env('NEXT_PUBLIC_SITE_URL')}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      return NextResponse.json(
        { ok: false, step: 'signInWithOtp', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, redirectTo, data })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    )
  }
}
