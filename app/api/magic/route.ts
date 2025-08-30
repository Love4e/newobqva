// app/api/magic/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get("email") || null;
  return NextResponse.json({ ok: true, via: "GET", email });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ ok: true, via: "POST", body });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST,GET,OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}
