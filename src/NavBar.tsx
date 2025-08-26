// src/components/NavBar.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

type Tab = 'discover' | 'chat' | 'profile';

export default function NavBar({
  tab, onChangeTab
}: { tab: Tab; onChangeTab: (t: Tab) => void }) {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setName(data.user?.user_metadata?.full_name ?? null);
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <span className="text-pink-600 text-xl">LoveLink</span>
        <nav className="flex gap-2">
          <button className={btn(tab==='discover')} onClick={()=>onChangeTab('discover')}>Открий</button>
          <button className={btn(tab==='chat')} onClick={()=>onChangeTab('chat')}>Чат</button>
          <button className={btn(tab==='profile')} onClick={()=>onChangeTab('profile')}>Профил</button>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        {name && <span className="opacity-70 hidden sm:block">Здравей, {name}!</span>}
        <button onClick={signOut}
                className="rounded-lg px-3 py-1.5 border border-neutral-300 hover:bg-neutral-50">
          Изход
        </button>
      </div>
    </header>
  );
}

function btn(active:boolean){
  return `px-3 py-1.5 rounded-lg ${active ? 'bg-neutral-900 text-white' : 'bg-neutral-100 hover:bg-neutral-200'}`;
}
