import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

type Props = {
  supabase: ReturnType<typeof createClient>;
};

type Profile = {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export default function ProfileForm({ supabase }: Props) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, bio, avatar_url')
        .eq('id', user.id)
        .maybeSingle();
      if (!error && data) setProfile(data as Profile);
      setLoading(false);
    })();
  }, [supabase]);

  const uploadAvatar = async (userId: string) => {
    if (!file) return profile?.avatar_url || null;
    const ext = file.name.split('.').pop();
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
    return pub?.publicUrl ?? null;
  };

  const onSave = async () => {
    if (!profile) return;
    setSaving(true);
    setMsg(null);
    try {
      const avatar_url = await uploadAvatar(profile.id);
      const { error } = await supabase.from('profiles').upsert(
        {
          id: profile.id,
          display_name: profile.display_name?.trim() || null,
          bio: profile.bio?.trim() || null,
          avatar_url,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
      if (error) throw error;
      setMsg('Запазено!');
    } catch (e: any) {
      setMsg(e.message ?? 'Грешка при запазване.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-sm text-slate-500">Зареждане…</div>;
  }
  if (!profile) {
    return <div className="text-center text-slate-500">Няма профил.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white/60 backdrop-blur rounded-2xl shadow p-6 space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar_url || 'https://placehold.co/120x120?text=Avatar'}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover ring-2 ring-white/70"
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block text-sm"
            />
            <p className="text-xs text-slate-500">PNG/JPG до ~5MB</p>
          </div>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1">
            <span className="text-sm text-slate-700">Име за показване</span>
            <input
              value={profile.display_name || ''}
              onChange={(e) =>
                setProfile((p) => (p ? { ...p, display_name: e.target.value } : p))
              }
              className="rounded-xl border border-slate-200 px-4 py-2"
              placeholder="Angel Uzunov"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-slate-700">Кратко био</span>
            <textarea
              value={profile.bio || ''}
              onChange={(e) =>
                setProfile((p) => (p ? { ...p, bio: e.target.value } : p))
              }
              rows={4}
              className="rounded-xl border border-slate-200 px-4 py-2"
              placeholder="Front-end ентусиаст и фен на пътуванията."
            />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">{msg}</div>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {saving ? 'Запазване…' : 'Запази'}
          </button>
        </div>
      </div>
    </div>
  );
}
