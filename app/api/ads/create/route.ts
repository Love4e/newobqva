import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(req: NextRequest){
  const supa = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supa.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, category, price, currency, photos } = await req.json()

  const { error } = await supa.from('ads').insert({
    title, description, category,
    price, currency, photos,
    owner_id: user.id,
    status: 'pending'
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
