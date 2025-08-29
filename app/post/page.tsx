'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function PostAdPage(){
  const supabase = createClientComponentClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Имот')
  const [price, setPrice] = useState<number | ''>('')
  const [currency, setCurrency] = useState<'BGN'|'EUR'>('BGN')
  const [photos, setPhotos] = useState<FileList|null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => { (async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Моля, влезте в профила си.')
      window.location.href = '/login'
      return
    }
    setReady(true)
  })() }, [])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    if (!ready) return

    let uploaded: string[] = []
    if (photos && photos.length){
      const bucket = 'ads'
      for (let i=0; i<Math.min(3, photos.length); i++){
        const f = photos[i]
        const path = `${Date.now()}_${Math.random().toString(36).slice(2)}_${f.name}`
        const { error } = await supabase.storage.from(bucket).upload(path, f, { upsert: true })
        if (error) return alert(error.message)
        const { data } = supabase.storage.from(bucket).getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    }

    const res = await fetch('/api/ads/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, description, category,
        price: price===''?null:Number(price),
        currency,
        photos: uploaded
      })
    })
    const json = await res.json()
    if (!res.ok) return alert(json.error || 'Грешка')
    alert('Изпратено за одобрение.')
    window.location.href = '/'
  }

  if (!ready) return null

  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-black mb-6">Публикувай обява</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Име на обявата</label>
          <input className="w-full border rounded-xl p-3" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1">Описание</label>
          <textarea className="w-full border rounded-xl p-3 h-44" value={description} onChange={e=>setDescription(e.target.value)} required/>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block mb-1">Цена</label>
            <input
              type="number" min="0" step="0.01"
              className="w-full border rounded-xl p-3"
              value={price as any}
              onChange={e=>setPrice(e.target.value==='' ? '' : Number(e.target.value))}
              placeholder="напр. 1200"
            />
          </div>
          <div>
            <label className="block mb-1">Валута</label>
            <select className="w-full border rounded-xl p-3" value={currency} onChange={e=>setCurrency(e.target.value as any)}>
              <option value="BGN">BGN</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block mb-1">Категория</label>
          <select className="w-full border rounded-xl p-3" value={category} onChange={e=>setCategory(e.target.value)}>
            <option>Имот</option><option>Автомобили</option><option>Техника</option><option>Услуги</option><option>Други</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Снимки (до 3)</label>
          <input type="file" multiple accept="image/*" onChange={e=>setPhotos(e.target.files)} />
        </div>
        <button className="btn">Изпрати за одобрение</button>
      </form>
    </main>
  )
}
