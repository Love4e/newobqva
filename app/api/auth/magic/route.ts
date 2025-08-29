// app/api/auth/magic/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL as string

function newClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error('Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON)
}

/**
 * Health check: open /api/auth/magic in the browser
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/auth/magic',
    siteUrl: SITE_URL || '(missing)',
    msg: 'Magic link API is alive',
  })
}

/**
 * Send Supabase Magic Link
 * Body: { email: string }
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({} as any))

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 })
    }

    const supabase = newClient()

    // URL, на който Supabase ще върне потребителя след клика в имейла.
    // Трябва да е позволен в Auth > URL Configuration (Site URL / Redirects)
    const redirectTo = SITE_URL ? `${SITE_URL}/auth/callback` : undefined

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: 'Magic link sent' })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
