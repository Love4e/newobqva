// src/pages/Discover.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Profile } from '../types';
import ProfileCard from '../components/ProfileCard';

export default function DiscoverPage() {
  const [list, setList] = useState<Profile[]>([]);
  const [filters, setFilters] = useState<{gender?:string; city?:string; zodiac?:string}>({});

  useEffect(() => { load(); }, [JSON.stringify(filters)]);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    let q = supabase.from('profiles').select('*').neq('id', user?.id ?? '');
    if (filters.gender) q = q.eq('gender', filters.gender);
    if (filters.city) q = q.ilike('city', `%${filters.city}%`);
    if (filters.zodiac) q = q.eq('zodiac', filters.zodiac);

    const { data, error } = await q.limit(20);
    if (error) { console.warn(error); return; }
    setList(data as Profile[]);
  }

  return (
    <div className="max-w-5xl mx-auto p-3">
      <div className="flex gap-2 mb-4">
        <select className="border rounded-lg p-2" value={filters.gender ?? ''} onChange={e=>setFilters(f=>({...f, gender:e.target.value||undefined}))}>
          <option value="">Пол</option><option>мъж</option><option>жена</option><option>друго</option>
        </select>
        <input className="border rounded-lg p-2" placeholder="Град"
               value={filters.city ?? ''} onChange={e=>setFilters(f=>({...f, city:e.target.value||undefined}))}/>
        <select className="border rounded-lg p-2" value={filters.zodiac ?? ''} onChange={e=>setFilters(f=>({...f, zodiac:e.target.value||undefined}))}>
          <option value="">Зодия</option>
          {['Овен','Телец','Близнаци','Рак','Лъв','Дева','Везни','Скорпион','Стрелец','Козирог','Водолей','Риби'].map(z=><option key={z}>{z}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <p className="opacity-70 text-center py-20">Няма профили за тези филтри.</p>
      ) : (
        <div className="grid gap-8">{list.map(p => <ProfileCard key={p.id} p={p} />)}</div>
      )}
    </div>
  );
}
