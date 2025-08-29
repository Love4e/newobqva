const API = process.env.REVOLUT_API_BASE || 'https://sandbox-merchant.revolut.com';
const VERSION = process.env.REVOLUT_API_VERSION || '2024-09-01';
const AUTH = `Bearer ${process.env.REVOLUT_API_KEY}`;
export async function createRevolutOrder(params:{amountMinor:number,currency:'BGN'|'EUR',description:string,redirectUrl:string}){
  const res = await fetch(`${API}/api/orders`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':AUTH,'Revolut-Api-Version':VERSION},body:JSON.stringify(params)});
  if(!res.ok) throw new Error(await res.text()); return res.json();
}