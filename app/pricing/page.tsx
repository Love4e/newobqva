'use client'
import { useState } from 'react';

export default function Pricing(){
  const [currency,setCurrency] = useState<'BGN'|'EUR'>('BGN');
  async function pay(){
    const res = await fetch('/api/revolut/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({purpose:'subscription',amount:currency==='BGN'?11.5:5.9,currency})});
    const json = await res.json(); if(json.checkoutUrl) window.location.href=json.checkoutUrl;
  }
  return <main><h1>Абонамент</h1><select value={currency} onChange={e=>setCurrency(e.target.value as any)}><option value='BGN'>BGN</option><option value='EUR'>EUR</option></select><button onClick={pay}>Плати</button></main>;
}