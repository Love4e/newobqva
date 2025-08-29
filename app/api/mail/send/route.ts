import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest){
  const { to, invoiceUrl } = await req.json();
  console.log('Send email to', to, invoiceUrl);
  return NextResponse.json({sent:true});
}