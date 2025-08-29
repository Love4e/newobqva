// app/api/auth/magic/route.ts
export const runtime = 'nodejs';          // <-- форсира Node runtime (не Edge)
export const dynamic = 'force-dynamic';   // <-- деактивира ISR/кеширане за рут-а

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL

const SUPABASE_ANON =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL

function newClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error('Missing env: SUPABASE_URL or SUPABASE_ANON_KEY')
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON)
}

export async function GET(req: Request) {
  const origin = new URL(req.url).origin
  return NextResponse.json({
    ok: true,
    route: '/api/auth/magic',
    siteUrl: SITE_URL ?? `${origin} (fallback)`,
    msg: 'Magic link API is alive',
  })
}

export async function POST(req: Request) {
  try {
    // 1) диагностичен ping – ако това падне с „fetch failed“, значи
    // от сървъра не се стига до Supabase
    const ping = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: SUPABASE_ANON as string },
    }).catch((e) => ({ ok: false, error: String(e) } as any))

    if (!(ping as any).ok) {
      return NextResponse.json(
        { ok: false, error: `Ping failed: ${(ping as any).error || 'no response'}` },
        { status: 502 },
      )
    }

    const body = await req.json().catch(() => null)
    const email = body?.email as string | undefined
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 })
    }

    const supabase = newClient()

    const origin = new URL(req.url).origin
    const redirectTo = `${SITE_URL ?? origin}/auth/callback`

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, redirectTo })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
