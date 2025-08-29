import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function Home(){
  const { data: ads } = await supabaseAdmin
    .from('ads')
    .select('id,title,description,photos,vip_until,created_at,status')
    .eq('status','approved')
    .order('vip_until',{ ascending:false })
    .order('created_at',{ ascending:false })
    .limit(18)

  const now = Date.now()
  const vip = (ads||[]).filter(a => a.vip_until && new Date(a.vip_until as any).getTime() > now)
  const regular = (ads||[]).filter(a => !a.vip_until || new Date(a.vip_until as any).getTime() <= now)

  return (
    <div className="space-y-8">
      <section className="hero p-6 sm:p-8">
        <h1 className="hero-title">Публикувай модерна обява за секунди</h1>
        <p className="hero-sub mt-1">Седмичен абонамент + VIP позиция за 24ч при нужда. Плащане в BGN/EUR.</p>
        <div className="mt-4 flex gap-2 flex-wrap">
          <a className="btn" href="/post">Пусни обява</a>
          <a className="navlink bg-white/10 hover:bg-white/20 rounded-md text-white" href="/pricing">Виж цените</a>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">VIP Обяви</h2>
          <a className="navlink" href="/browse">Виж всички</a>
        </div>
        {vip.length === 0 ? (
          <p className="text-slate-600 mt-2">Все още няма активни VIP обяви.</p>
        ) : (
          <div className="grid-cards mt-3">
            {vip.map((a:any) => <AdCard key={a.id} ad={a} vip />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-extrabold">Нови обяви</h2>
        <div className="grid-cards mt-3">
          {regular.map((a:any) => <AdCard key={a.id} ad={a} />)}
        </div>
      </section>
    </div>
  )
}

function AdCard({ ad, vip=false }:{ ad:any, vip?:boolean }){
  return (
    <a href={`/ads/${ad.id}`} className="card overflow-hidden block">
      <div className="relative">
        <div className="aspect-video">
          {ad.photos?.[0] ? <img src={ad.photos[0]} alt="" /> : null}
        </div>
        {vip && <div className="badge absolute left-2 top-2">VIP</div>}
      </div>
      <div className="p-4">
        <div className="font-bold">{ad.title}</div>
        <div className="text-slate-600 text-sm line-clamp-2">{ad.description}</div>
      </div>
    </a>
  )
}
