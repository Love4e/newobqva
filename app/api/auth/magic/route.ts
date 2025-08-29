// app/api/auth/magic/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  (process.env.SUPABASE_URL as string) ||
  (process.env.NEXT_PUBLIC_SUPABASE_URL as string)

const SUPABASE_ANON =
  (process.env.SUPABASE_ANON_KEY as string) ||
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL as string) || undefined

function newClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error(
      'Missing env: SUPABASE_URL / SUPABASE_ANON_KEY (or NEXT_PUBLIC_*)'
    )
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
    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { ok: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    const body = await req.json().catch(() => null)
    const email = body?.email as string | undefined
    if (!email) {
      return NextResponse.json(
        { ok: false, error: 'Missing email' },
        { status: 400 }
      )
    }

    const supabase = newClient()

    const origin = new URL(req.url).origin
    const redirectTo = `${SITE_URL ?? origin}/auth/callback`

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, redirectTo })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
