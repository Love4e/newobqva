import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function Browse(){
  const { data: ads } = await supabaseAdmin
    .from('ads')
    .select('id,title,description,photos,vip_until,created_at,status,category')
    .eq('status','approved')
    .order('created_at',{ ascending:false })
    .limit(60)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black tracking-tight">Всички обяви</h1>
      <div className="grid-cards">
        {(ads||[]).map((a:any) => (
          <a key={a.id} href={`/ads/${a.id}`} className="card overflow-hidden block">
            <div className="aspect-video">{a.photos?.[0] ? <img src={a.photos[0]} alt="" /> : null}</div>
            <div className="p-4">
              <div className="font-bold">{a.title}</div>
              <div className="text-slate-600 text-sm line-clamp-2">{a.description}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
