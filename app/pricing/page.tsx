'use client'
import { useMemo, useState } from 'react'

export default function Pricing() {
  const [currency, setCurrency] = useState<'BGN'|'EUR'>('BGN')

  const links = useMemo(() => ({
    sub: currency === 'BGN'
      ? process.env.NEXT_PUBLIC_REVOLUT_LINK_SUB_BGN || process.env.REVOLUT_LINK_SUB_BGN
      : process.env.NEXT_PUBLIC_REVOLUT_LINK_SUB_EUR || process.env.REVOLUT_LINK_SUB_EUR,
    vip: currency === 'BGN'
      ? process.env.NEXT_PUBLIC_REVOLUT_LINK_VIP_BGN || process.env.REVOLUT_LINK_VIP_BGN
      : process.env.NEXT_PUBLIC_REVOLUT_LINK_VIP_EUR || process.env.REVOLUT_LINK_VIP_EUR,
  }), [currency])

  function pay(url?: string | null) {
    if (!url) return alert('Линкът за плащане не е конфигуриран.')
    window.open(url, '_blank')  // отваря Revolut Checkout в нов таб
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Абонамент & VIP</h1>
      <div className="mt-4 flex gap-3 items-center">
        <label>Валута:</label>
        <select value={currency} onChange={e=>setCurrency(e.target.value as any)} className="border rounded-md px-2 py-1">
          <option value="BGN">BGN</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="border rounded-xl p-4 bg-white">
          <h2 className="font-bold text-lg">Седмичен абонамент (7 дни)</h2>
          <p className="text-sm text-slate-600">Дава право за публикуване/поддържане на обяви за 7 дни.</p>
          <button onClick={()=>pay(links.sub)} className="mt-3 rounded-xl bg-slate-900 text-white px-4 py-2">
            Плати (Revolut)
          </button>
        </div>
        <div className="border rounded-xl p-4 bg-white">
          <h2 className="font-bold text-lg">VIP позиция (24 часа)</h2>
          <p className="text-sm text-slate-600">Обявата се показва най-отгоре в секция VIP за 24 часа.</p>
          <button onClick={()=>pay(links.vip)} className="mt-3 rounded-xl bg-slate-900 text-white px-4 py-2">
            Плати VIP (Revolut)
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-600">
        След като видим плащането в Revolut, администратор ще активира плана ви ръчно (7 дни / 24ч VIP).
      </p>
    </main>
  )
}
