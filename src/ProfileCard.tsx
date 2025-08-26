// src/components/ProfileCard.tsx
import { Profile } from '../types';

export default function ProfileCard({ p }: { p: Profile }) {
  return (
    <article className="rounded-3xl overflow-hidden shadow-xl max-w-4xl mx-auto">
      <div className="relative aspect-[16/9] bg-neutral-200">
        {p.avatar_url && (
          <img src={p.avatar_url} className="w-full h-full object-cover" alt={p.display_name ?? 'Профил'} />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
          <h3 className="text-2xl font-semibold">
            {p.display_name ?? 'Потребител'}{p.bio ? ',' : ''}{' '}
            {p.bio ? '' : ''}
          </h3>
          <p className="opacity-90">{[p.city, p.zodiac].filter(Boolean).join(' · ')}</p>
          {p.bio && <p className="opacity-90 mt-1">{p.bio}</p>}
        </div>
      </div>
    </article>
  );
}
