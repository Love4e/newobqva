
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
    <div>
      <section className="card">
        <h1 className="text-2xl" style={{fontWeight:900}}>Публикувай модерна обява за секунди</h1>
        <p className="text-muted">Седмичен абонамент + VIP позиция за 24ч при нужда. Плащане в BGN/EUR.</p>
        <div style={{marginTop:'12px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
          <a className="btn" href="/post">Пусни обява</a>
          <a className="navlink" href="/pricing">Виж цените</a>
        </div>
      </section>

      <section style={{marginTop:'24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 className="text-xl" style={{fontWeight:800}}>VIP Обяви</h2>
          <a className="navlink" href="/browse">Виж всички</a>
        </div>
        {vip.length === 0 ? <p className="text-muted">Все още няма активни VIP обяви.</p> : (
          <div className="grid grid-3" style={{marginTop:'12px'}}>
            {vip.map(a => <AdCard key={a.id} ad={a} vip />)}
          </div>
        )}
      </section>

      <section style={{marginTop:'24px'}}>
        <h2 className="text-xl" style={{fontWeight:800}}>Нови обяви</h2>
        <div className="grid grid-3" style={{marginTop:'12px'}}>
          {regular.map(a => <AdCard key={a.id} ad={a} />)}
        </div>
      </section>
    </div>
  )
}

function AdCard({ ad, vip=false }:{ ad:any, vip?:boolean }){
  return (
    <a href={`/ads/${ad.id}`} className="card" style={{padding:0, overflow:'hidden', display:'block'}}>
      {vip && <div className="badge" style={{position:'absolute',margin:'8px'}}>VIP</div>}
      <div className="aspect-video">
        {ad.photos?.[0] ? <img src={ad.photos[0]} alt="" /> : null}
      </div>
      <div style={{padding:'12px'}}>
        <div style={{fontWeight:800}}>{ad.title}</div>
        <div className="text-muted" style={{fontSize:'14px'}}>{ad.description}</div>
      </div>
    </a>
  )
}
