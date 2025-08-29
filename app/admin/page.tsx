
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Ad = { id: string; title: string; description: string; category: string; photos: string[]; owner_id: string }

export default function AdminPage(){
  const [role, setRole] = useState<'user'|'admin'|null>(null)
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data:auth } = await supabase.auth.getUser()
      if(!auth.user){ setRole(null); setLoading(false); return }
      const { data:profile } = await supabase.from('profiles').select('role').eq('id', auth.user.id).single()
      setRole((profile?.role as any) || 'user')
      await loadPending()
    })()
  }, [])

  async function loadPending(){
    const { data, error } = await supabase.from('ads').select('id,title,description,category,photos,owner_id').eq('status','pending').order('created_at',{ascending:false})
    if(!error) setAds(data||[])
    setLoading(false)
  }

  async function approve(id:string){
    const { error } = await supabase.from('ads').update({ status:'approved', expires_at: new Date(Date.now()+7*24*60*60*1000).toISOString() }).eq('id', id)
    if(!error){ setAds(prev=>prev.filter(a=>a.id!==id)) }
  }
  async function reject(id:string){
    if(!confirm('Отхвърляне на обявата?')) return
    const { error } = await supabase.from('ads').delete().eq('id', id)
    if(!error){ setAds(prev=>prev.filter(a=>a.id!==id)) }
  }

  if(loading) return <main className="p-6">Зареждане...</main>
  if(role!=='admin') return <main className="p-6"><h1 className="text-xl font-bold">Админ панел</h1><p className="text-slate-600 mt-2">Нямате админ права.</p></main>

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">Админ панел — Чакащи</h1>
      {ads.length===0 ? <p className="mt-4 text-slate-600">Няма чакащи обяви.</p> : (
        <div className="mt-6 space-y-4">
          {ads.map(ad => (
            <div key={ad.id} className="border rounded-xl p-4 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold">{ad.title}</div>
                  <div className="text-sm text-slate-600">{ad.description}</div>
                  <div className="text-xs text-slate-500 mt-1">Категория: {ad.category}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>approve(ad.id)} className="rounded-lg bg-emerald-600 text-white px-3 py-1 text-sm">Одобри</button>
                  <button onClick={()=>reject(ad.id)} className="rounded-lg bg-rose-600 text-white px-3 py-1 text-sm">Отхвърли</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
