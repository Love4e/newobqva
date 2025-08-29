import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest){
  const { paymentId } = await req.json();
  return NextResponse.json({invoiceUrl:`https://example.com/invoice/${paymentId}`});
}