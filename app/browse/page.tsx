
'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Ad = { id: string; title: string; description: string; category: string; photos: string[]; vip_until: string|null }

export default function BrowsePage(){
  const [ads, setAds] = useState<Ad[]>([])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('Всички')

  useEffect(() => { load() }, [])

  async function load(){
    const { data } = await supabase.from('ads').select('id,title,description,category,photos,vip_until').eq('status','approved').order('vip_until',{ascending:false}).order('created_at',{ascending:false})
    setAds(data||[])
  }

  const filtered = useMemo(()=>{
    return ads.filter(a => (cat==='Всички' || a.category===cat) && (q==='' || (a.title+' '+a.description).toLowerCase().includes(q.toLowerCase())))
  }, [ads, q, cat])

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold">Обяви</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <input className="border rounded-lg p-2 flex-1 min-w-[240px]" placeholder="Търси..." value={q} onChange={e=>setQ(e.target.value)} />
        <select className="border rounded-lg p-2" value={cat} onChange={e=>setCat(e.target.value)}>
          <option>Всички</option><option>Имоти</option><option>Авто</option><option>Електроника</option><option>Услуги</option><option>Спорт</option><option>Други</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map(ad => (
          <a key={ad.id} href={`/app/ads/${ad.id}`} className="border rounded-xl overflow-hidden bg-white">
            <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-400">
              {ad.photos?.[0] ? <img src={ad.photos[0]} className="w-full h-full object-cover" /> : 'Без снимка'}
            </div>
            <div className="p-3">
              <div className="font-bold line-clamp-2">{ad.title}</div>
              <div className="text-sm text-slate-600 line-clamp-2">{ad.description}</div>
              {ad.vip_until && new Date(ad.vip_until).getTime() > Date.now() && <div className="text-xs text-amber-600 mt-1 font-semibold">VIP</div>}
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
