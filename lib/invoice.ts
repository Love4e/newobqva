
export function generateInvoiceHTML(opts: {
  id: string
  buyerName: string
  buyerEmail: string
  amount: number
  currency: 'BGN'|'EUR'
  purpose: 'subscription'|'vip'
  createdAt?: string
}) {
  const symbol = opts.currency === 'BGN' ? 'лв' : '€'
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${opts.id}</title>
  <style>body{font-family:system-ui;padding:24px;color:#0f172a} td,th{border-bottom:1px solid #e5e7eb;padding:8px}</style></head><body>
  <h1>Фактура ${opts.id}</h1>
  <div>Клиент: <b>${opts.buyerName}</b> • ${opts.buyerEmail}</div>
  <div>Дата: ${opts.createdAt || new Date().toLocaleString()}</div>
  <table width="100%"><thead><tr><th align="left">Описание</th><th align="right">Сума</th></tr></thead>
  <tbody><tr><td>${opts.purpose === 'subscription' ? 'Седмичен абонамент' : 'VIP позиция (24ч)'}</td><td align="right">${opts.amount.toFixed(2)} ${symbol}</td></tr></tbody></table>
  <h2>Общо: ${opts.amount.toFixed(2)} ${symbol}</h2></body></html>`
  return html
}
