import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase.from("profiles").select("id, email, subscription_until")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { userId, action } = await req.json()
  let newDate = null

  if (action === "activate") {
    newDate = new Date()
    newDate.setDate(newDate.getDate() + 7)
  }

  const { error } = await supabase
    .from("profiles")
    .update({ subscription_until: newDate })
    .eq("id", userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
