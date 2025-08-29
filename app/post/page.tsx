
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Cat = 'Имоти'|'Авто'|'Електроника'|'Услуги'|'Спорт'|'Други'

export default function PostAdPage(){
  const [userId, setUserId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Cat>('Други')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    if(!userId) return alert('Моля, влезте в профила си.')
    if(!title || !description) return alert('Попълнете заглавие и описание.')
    setLoading(true)
    try {
      // качване на снимки (до 3) в bucket 'ads'
      const photoUrls: string[] = []
      for (let i=0; i<Math.min(files.length,3); i++){
        const f = files[i]
        const ext = f.name.split('.').pop() || 'jpg'
        const path = `${userId}/${Date.now()}_${i}.${ext}`
        const { data, error } = await supabase.storage.from('ads').upload(path, f, { upsert: false })
        if(error) throw error
        const { data:pub } = supabase.storage.from('ads').getPublicUrl(data.path)
        photoUrls.push(pub.publicUrl)
      }
      // запис в таблица ads
      const { error:insErr } = await supabase.from('ads').insert({
        owner_id: userId,
        title,
        description,
        category,
        photos: photoUrls,
        status: 'pending'
      })
      if(insErr) throw insErr
      setTitle(''); setDescription(''); setFiles([])
      alert('Обявата е изпратена за одобрение.')
    } catch (err:any){
      console.error(err)
      alert('Грешка при публикуване: ' + (err?.message||'unknown'))
    } finally { setLoading(false) }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Публикувай обява</h1>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Име на обявата</label>
          <input className="w-full border rounded-lg p-2" value={title} onChange={e=>setTitle(e.target.value)} required maxLength={80} />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Описание</label>
          <textarea className="w-full border rounded-lg p-2" value={description} onChange={e=>setDescription(e.target.value)} rows={6} required />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Категория</label>
          <select className="w-full border rounded-lg p-2" value={category} onChange={e=>setCategory(e.target.value as Cat)}>
            <option>Имоти</option><option>Авто</option><option>Електроника</option><option>Услуги</option><option>Спорт</option><option>Други</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Снимки (до 3)</label>
          <input type="file" accept="image/*" multiple onChange={(e)=>setFiles(Array.from(e.target.files||[]).slice(0,3))} />
          {files.length>0 && <p className="text-xs text-slate-600 mt-1">Избрани: {files.map(f=>f.name).join(', ')}</p>}
        </div>
        <button disabled={loading} className="rounded-xl bg-slate-900 text-white px-4 py-2">{loading?'Качване...':'Изпрати за одобрение'}</button>
      </form>
    </main>
  )
}
