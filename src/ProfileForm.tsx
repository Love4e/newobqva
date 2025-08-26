// src/components/ProfileForm.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Profile } from '../types';

const zodiacs = ['Овен','Телец','Близнаци','Рак','Лъв','Дева','Везни','Скорпион','Стрелец','Козирог','Водолей','Риби'];

export default function ProfileForm() {
  const [p, setP] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return;

    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error) { console.warn(error); return; }
    setP(data as Profile);
  }

  async function save() {
    if(!p) return;
    setSaving(true);
    try {
      let avatar_url = p.avatar_url;

      if (file) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const path = `${user.id}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
        if (upErr) throw upErr;

        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        avatar_url = data.publicUrl;
      }

      const update = { ...p, avatar_url };
      const { error } = await supabase.from('profiles').upsert(update);
      if (error) throw error;

      await load();
      alert('Профилът е запазен!');
    } catch (e:any) {
      alert('Грешка: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  if(!p) return <p className="opacity-60">Зареждане…</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Име" value={p.display_name ?? ''} onChange={v=>setP({...p, display_name:v})}/>
        <Select label="Пол" value={p.gender ?? ''} onChange={v=>setP({...p, gender: v as any})}
                options={['мъж','жена','друго']} />
        <Input label="Град" value={p.city ?? ''} onChange={v=>setP({...p, city:v})}/>
        <Select label="Зодия" value={p.zodiac ?? ''} onChange={v=>setP({...p, zodiac: v})}
                options={zodiacs}/>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">За мен</label>
          <textarea className="w-full rounded-lg border p-2" rows={3}
                    value={p.bio ?? ''} onChange={e=>setP({...p, bio:e.target.value})}/>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Снимка (аватар)</label>
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] ?? null)}/>
          {p.avatar_url && <img src={p.avatar_url} className="mt-3 h-28 rounded-lg object-cover" />}
        </div>
      </div>

      <button onClick={save} disabled={saving}
              className="mt-4 rounded-lg px-4 py-2 bg-neutral-900 text-white hover:opacity-90 disabled:opacity-50">
        {saving ? 'Запис…' : 'Запази'}
      </button>
    </div>
  );
}

function Input({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input className="w-full rounded-lg border p-2" value={value} onChange={e=>onChange(e.target.value)} />
    </div>
  );
}
function Select({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:string[];}){
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select className="w-full rounded-lg border p-2" value={value} onChange={e=>onChange(e.target.value)}>
        <option value="">—</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
