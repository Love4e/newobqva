import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './supabase' // безопасен import (ако няма secrets -> null)

type Profile = {
  id: string
  name: string
  age: number
  city: string
  bio: string
  interests: string[]
  image: string
}

// ---------------------- Икони (inline SVG, без външни пакети) ----------------------
const IconX = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
  </svg>
)
const IconBolt = (p: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M13 2L3 14h7l-1 8 11-14h-7l1-6z" />
  </svg>
)
const IconHeart = (p: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 21s-6.716-4.263-9.428-7.5C.424 11.108.86 7.76 3.293 6.2 5.14 5 7.59 5.47 9 7c1.41-1.53 3.86-2 5.707-.8 2.434 1.56 2.87 4.908.721 7.3C18.716 16.737 12 21 12 21z" />
  </svg>
)

// ---------------------- Навигация ----------------------
function TopNav() {
  const base = 'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium'
  const active = 'bg-black text-white shadow-sm'
  const idle = 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="text-xl font-bold">LoveLink</div>
        <nav className="flex gap-2">
          <NavLink to="/discover" className={({isActive}) => `${base} ${isActive ? active : idle}`}>Открий</NavLink>
          <NavLink to="/chat" className={({isActive}) => `${base} ${isActive ? active : idle}`}>Чат</NavLink>
          <NavLink to="/profile" className={({isActive}) => `${base} ${isActive ? active : idle}`}>Профил</NavLink>
        </nav>
      </div>
    </header>
  )
}

// ---------------------- DEMO данни за „Открий“ ----------------------
const demoProfiles: Profile[] = [
  {
    id: 'p1',
    name: 'Ива',
    age: 27,
    city: 'София',
    bio: 'Вярвам в добрия разговор и спонтанните пътувания.',
    interests: ['йога', 'кино', 'планина'],
    image:
      'https://images.unsplash.com/photo-1508341591423-4347099e1f19?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'p2',
    name: 'Мария',
    age: 29,
    city: 'Пловдив',
    bio: 'Кафе, книги и уикенд бягства из Родопите.',
    interests: ['книги', 'кафе', 'природа'],
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'p3',
    name: 'Деси',
    age: 26,
    city: 'Варна',
    bio: 'Обичам морето, сутрешния сърф и залезите.',
    interests: ['сърф', 'музика', 'фото'],
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1400&auto=format&fit=crop',
  },
]

// ---------------------- Открий ----------------------
function DiscoverView() {
  const [i, setI] = useState(0)
  const card = demoProfiles[i]

  const next = () => setI((v) => (v + 1) % demoProfiles.length)
  const prev = () => setI((v) => (v - 1 + demoProfiles.length) % demoProfiles.length)

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {/* Филтри */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select className="rounded-xl border px-3 py-2 bg-white">
          <option>Пол</option>
          <option>Жена</option>
          <option>Мъж</option>
        </select>
        <select className="rounded-xl border px-3 py-2 bg-white">
          <option>Град</option>
          <option>София</option>
          <option>Пловдив</option>
          <option>Варна</option>
        </select>
        <select className="rounded-xl border px-3 py-2 bg-white">
          <option>Зодия</option>
          <option>Лъв</option>
          <option>Дева</option>
          <option>Везни</option>
        </select>
      </div>

      {/* Карта */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl bg-white">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-[62vh] object-cover select-none"
          draggable={false}
        />

        {/* Градиент в дъното */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Инфо */}
        <div className="absolute left-6 bottom-6 text-white">
          <div className="text-2xl font-bold drop-shadow">{card.name}, {card.age}</div>
          <div className="mt-2 flex gap-2">
            {card.interests.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-xs"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-2 text-white/90 max-w-xl">{card.bio}</div>
        </div>

        {/* Контроли */}
        <div className="absolute -bottom-6 left-0 right-0 flex items-center justify-center gap-4 pb-2">
          <button
            onClick={prev}
            className="h-14 w-14 rounded-full bg-white text-gray-800 shadow-lg grid place-items-center hover:scale-105 transition"
            title="Назад"
          >
            <IconX className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="h-16 w-16 rounded-full bg-amber-400 text-white shadow-lg grid place-items-center hover:scale-105 transition"
            title="Харесай бързо"
          >
            <IconBolt className="h-7 w-7" />
          </button>
          <button
            onClick={next}
            className="h-14 w-14 rounded-full bg-rose-500 text-white shadow-lg grid place-items-center hover:scale-105 transition"
            title="Харесай"
          >
            <IconHeart className="h-6 w-6" />
          </button>
        </div>
      </section>
    </main>
  )
}

// ---------------------- Чат ----------------------
type Msg = { id: string; fromMe: boolean; text: string; ts: number }
function ChatView() {
  const [threads] = useState([
    { id: 't1', name: 'Ива' },
    { id: 't2', name: 'Мария' },
    { id: 't3', name: 'Деси' },
  ])
  const [active, setActive] = useState('t1')
  const [messages, setMessages] = useState<Record<string, Msg[]>>({
    t1: [
      { id: 'm1', fromMe: false, text: 'Здрасти! 🙂', ts: Date.now() - 1000 * 60 * 60 },
      { id: 'm2', fromMe: true, text: 'Хей, как мина денят?', ts: Date.now() - 1000 * 60 * 30 },
    ],
    t2: [],
    t3: [],
  })
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const list = messages[active] || []
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [list.length, active])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const msg: Msg = { id: crypto.randomUUID(), fromMe: true, text, ts: Date.now() }
    setMessages((m) => ({ ...m, [active]: [...(m[active] ?? []), msg] }))
    setInput('')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[280px_1fr] gap-4">
      {/* Листа с разговори */}
      <aside className="rounded-2xl border bg-white">
        <div className="p-3 font-semibold border-b">Разговори</div>
        <ul>
          {threads.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => setActive(t.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                  active === t.id ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                {t.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Съобщения */}
      <section className="rounded-2xl border bg-white flex flex-col h-[70vh]">
        <div className="p-3 border-b font-semibold">Чат с {threads.find(t => t.id === active)?.name}</div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {list.map((m) => (
            <div key={m.id} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                  m.fromMe ? 'bg-black text-white rounded-br-sm' : 'bg-gray-100 rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="p-3 border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === 'Enter' ? send() : null)}
            className="flex-1 rounded-xl border px-3 py-2"
            placeholder="Напиши съобщение…"
          />
          <button
            onClick={send}
            className="rounded-xl bg-black text-white px-4 py-2 hover:opacity-90"
          >
            Изпрати
          </button>
        </div>
      </section>
    </div>
  )
}

// ---------------------- Профил ----------------------
function ProfileView() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(() => {
    const raw = localStorage.getItem('ll_profile')
    return (
      (raw && JSON.parse(raw)) || {
        name: '',
        age: 25,
        city: '',
        interests: '',
        about: '',
      }
    )
  })

  const onSave = async () => {
    setSaving(true)
    try {
      localStorage.setItem('ll_profile', JSON.stringify(form))
      // Ако имаме Supabase – правим upsert (няма да чупи при липса)
      if (supabase) {
        const { error } = await supabase.from('profiles').upsert({
          name: form.name,
          age: Number(form.age),
          city: form.city,
          interests: form.interests,
          about: form.about,
          updated_at: new Date().toISOString(),
        })
        if (error) console.warn('[Supabase upsert]', error.message)
      }
      navigate('/discover')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Профил</h1>

      <div className="rounded-2xl border bg-white p-5 space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Име</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Име"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Години</label>
            <input
              type="number"
              className="w-full rounded-xl border px-3 py-2"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
              min={18}
              max={99}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Град</label>
            <input
              className="w-full rounded-xl border px-3 py-2"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="София"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Интереси (запетайки)</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            value={form.interests}
            onChange={(e) => setForm({ ...form, interests: e.target.value })}
            placeholder="йога, кино, планина"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">За мен</label>
          <textarea
            className="w-full rounded-xl border px-3 py-2 min-h-[120px]"
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            placeholder="Кратко представяне…"
          />
        </div>

        <div className="pt-2">
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-xl bg-black text-white px-5 py-2.5 hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'Запис…' : 'Запази'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------- Главен App ----------------------
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <Routes>
        <Route path="/" element={<Navigate to="/discover" replace />} />
        <Route path="/discover" element={<DiscoverView />} />
        <Route path="/chat" element={<ChatView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="*" element={<Navigate to="/discover" replace />} />
      </Routes>
    </div>
  )
}
