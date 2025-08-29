
import { supabaseAdmin } from '@/lib/supabaseAdmin'

type Params = { params: { id: string } }

export default async function AdDetail({ params }: Params){
  const { data: ad } = await supabaseAdmin.from('ads').select('*').eq('id', params.id).single()
  if(!ad) return <main className="p-6">Обявата не е намерена.</main>
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">{ad.title}</h1>
      <div className="text-slate-600 mt-2">{ad.description}</div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {(ad.photos||[]).map((p:string, i:number) => <img key={i} src={p} className="w-full h-40 object-cover rounded-lg border" />)}
      </div>
      <div className="mt-3 text-sm text-slate-500">Категория: {ad.category} • Статус: {ad.status}</div>
    </main>
  )
}
