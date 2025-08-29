
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// HMAC SHA-256 verification for Revolut webhook
function verifySignature(raw: string, timestamp: string, signature: string, secret: string) {
  const payload = `v1.${timestamp}.${raw}`
  const digest = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  const expected = `v1=${digest}`
  return signature.split(',').map(s=>s.trim()).includes(expected)
}

export async function POST(req: NextRequest) {
  const secret = process.env.REVOLUT_WEBHOOK_SECRET
  const ts = req.headers.get('Revolut-Request-Timestamp') || ''
  const sig = req.headers.get('Revolut-Signature') || ''
  const raw = await req.text()

  if (!secret || !verifySignature(raw, ts, sig, secret)) {
    return NextResponse.json({ error: 'bad signature' }, { status: 400 })
  }

  const evt = JSON.parse(raw)
  // TODO: тук обнови таблица payments -> status=paid и активирай абонамент/VIP
  // пример:
  // const orderId = evt?.data?.id
  // await supabaseAdmin.from('payments').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('provider_order_id', orderId)

  return NextResponse.json({ received: true })
}
