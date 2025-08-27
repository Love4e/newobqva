// src/App.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Heart, X, MessageCircle, UserRound, Coins, Crown,
  Flame, Star, ShieldCheck, Loader2, LogOut, Chrome
} from "lucide-react";
import { createClient, Session } from "@supabase/supabase-js";

/* =====================================================
   LoveLink — MVP (Supabase + PWA + OAuth Google only)
   ВХОД: PKCE + exchangeCodeForSession + redirectTo към BASE_URL
   ===================================================== */

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://gazaegcwedqiyaefkgsr.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhemFlZ2N3ZWRxaXlhZWZrZ3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDU3NzYsImV4cCI6MjA3MTcyMTc3Nn0.DCz7PhdKzQiOGgQwjgZ3JdOS4LfB-Bmb32VatfRsHB8";

/** ВАЖНО: flowType: 'pkce' (PKCE работи коректно с HashRouter/GitHub Pages) */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: "pkce",
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

const DEMO_USERS = [
  { id:"u1", name:"Ива",   age:27, gender:"Жена", zodiac:"Везни", city:"София",
    interests:["йога","кино","планина"],
    bio:"Вярвам в добрия разговор и спонтанните пътувания.",
    photos:["https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop"], online:true },
  { id:"u2", name:"Алекс", age:31, gender:"Мъж",  zodiac:"Лъв", city:"Пловдив",
    interests:["тех","фитнес","музика"],
    bio:"Front-end ентусиаст и фен на пътуванията.",
    photos:["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop"], online:true },
  { id:"u3", name:"Мария", age:22, gender:"Жена", zodiac:"Риби", city:"Варна",
    interests:["изкуство","книги","йога"],
    bio:"Морско момиче с голяма библиотека и любопитство.",
    photos:["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop"], online:false },
];

const cn  = (...c: (string|false|undefined)[]) => c.filter(Boolean).join(" ");
const uid = () => (crypto as any)?.randomUUID?.() || Math.random().toString(36).slice(2);

/* =============================
   Action Dock (мобилни бутони)
   ============================= */
function ActionDock({
  visible, onDislike, onMessage, onLike,
}: {
  visible: boolean;
  onDislike: () => void;
  onMessage: () => void;
  onLike: () => void;
}) {
  if (!visible) return null;
  return (
    <div
      className={`
        fixed left-1/2 -translate-x-1/2 pointer-events-auto z-[2147483647]
        bottom-[calc(88px+env(safe-area-inset-bottom)+12px)]
        md:bottom-[calc(12px+env(safe-area-inset-bottom))]
      `}
    >
      <div className="pointer-events-none absolute -z-10 left-1/2 -translate-x-1/2 bottom-1">
        <div className="h-14 w-[320px] blur-2xl rounded-full bg-black/10 dark:bg-black/20" />
      </div>

      <div className="flex items-center gap-5 [--btn:3.5rem] sm:[--btn:4rem]">
        <DockBtn label="Откажи" className="bg-white text-gray-700 ring-1 ring-black/10" onClick={onDislike}>
          <X className="h-6 w-6" />
        </DockBtn>
        <DockBtn label="Съобщение" className="bg-amber-400 text-white ring-1 ring-black/10" onClick={onMessage}>
          <MessageCircle className="h-6 w-6" />
        </DockBtn>
        <DockBtn label="Харесай" className="bg-rose-500 text-white ring-1 ring-black/10" onClick={onLike}>
          <Heart className="h-6 w-6" />
        </DockBtn>
      </div>
    </div>
  );
}
function DockBtn({
  children, label, className = "", onClick,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`size-[var(--btn)] flex items-center justify-center rounded-full
                  shadow-2xl focus:outline-none focus-visible:ring-4
                  focus-visible:ring-white/60 focus-visible:ring-offset-2
                  focus-visible:ring-offset-white/60 ${className}`}
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      {children}
    </motion.button>
  );
}

/* ============== AUTH ============== */
/** Само Google вход (PKCE) – с точен redirect към BASE_URL */
function AuthGate({ setMe }: { setMe: (v: any) => void }) {
  const [loading, setLoad] = useState(false);
  const [err, setErr] = useState("");

  async function signInGoogle() {
    try {
      setLoad(true); setErr("");

      // Абсолютен URL към базовия подпът (напр. https://<user>.github.io/lovelink-mvp/)
      const redirectTo = new URL(
        import.meta.env.BASE_URL || "/",
        window.location.origin
      ).toString();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) throw error; // Supabase ще пренасочи
    } catch (e: any) {
      setErr(e.message || String(e));
      setLoad(false);
    }
  }

  // Ако провайдърът е върнал грешка в URL-а – покажи я
  useEffect(() => {
    const u = new URL(window.location.href);
    const desc = u.searchParams.get("error_description");
    if (desc) setErr(decodeURIComponent(desc));
  }, []);

  return (
    <div className="min-h-[80vh] grid place-items-center p-6 bg-[radial-gradient(ellipse_at_top,_#ffe4ea,_#eef3ff)]">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur border rounded-3xl p-5 shadow-xl">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-rose-500" />
          <div className="text-xl font-extrabold">LoveLink</div>
        </div>
        <div className="mt-1 text-sm text-neutral-600">Вход/регистрация</div>

        <button
          onClick={signInGoogle}
          disabled={loading}
          className="mt-5 w-full px-4 py-3 rounded-2xl border flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Chrome className="h-4 w-4 text-rose-500" />}
          Вход с Google
        </button>

        {err && <div className="mt-3 text-sm text-rose-600">{err}</div>}

        <div className="mt-4 text-xs text-neutral-500 flex items-center gap-1">
          <ShieldCheck className="h-4 w-4" /> Защитено от Supabase Auth
        </div>
      </div>
    </div>
  );
}

/* Онлайн присъствие (опционално) */
function usePresence(me: any) {
  useEffect(() => {
    if (!me?.id) return;
    const channel = supabase.channel("online", { config: { presence: { key: me.id } } });
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") channel.track({ id: me.id, name: me.name, city: me.city });
    });
    return () => { channel.unsubscribe(); };
  }, [me?.id]);
}

/* =========== Swipe Card =========== */
function SwipeCard({
  user, onLike, onNope, onMessage,
}: {
  user: any; onLike: (u: any) => void; onNope: (u: any) => void; onMessage: (u: any) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);
  const opacityRight = useTransform(x, [50, 120], [0, 1]);
  const opacityLeft = useTransform(x, [-120, -50], [1, 0]);

  return (
    <motion.div
      className="relative h-[68vh] min-h-[440px] rounded-[28px] overflow-hidden shadow-2xl border bg-neutral-900"
      style={{ x, rotate }}
      drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.8}
      onDragEnd={(e, info) => {
        const t = 120;
        if (info.offset.x > t) onLike(user);
        else if (info.offset.x < -t) onNope(user);
        else x.set(0);
      }}
    >
      <img src={user.photos?.[0]} alt={user.name} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/60" />
      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 text-white text-xs">
        {user.city} · {user.zodiac}
      </div>
      <div className="absolute bottom-0 w-full p-4">
        <div className="text-white text-2xl font-extrabold drop-shadow">
          {user.name}, {user.age}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {(user.interests || []).slice(0, 4).map((i: string, idx: number) => (
            <span key={idx} className="px-2 py-1 rounded-full text-xs bg-white/80 text-neutral-800">
              {i}
            </span>
          ))}
        </div>
        <div className="mt-2 text-white/90 text-sm drop-shadow">{user.bio}</div>
      </div>

      <motion.div style={{ opacity: opacityRight }}
        className="absolute top-5 right-5 px-3 py-1.5 rounded-xl bg-emerald-500/90 text-white text-sm">LIKE</motion.div>
      <motion.div style={{ opacity: opacityLeft }}
        className="absolute top-5 left-5 px-3 py-1.5 rounded-xl bg-rose-500/90 text-white text-sm">NOPE</motion.div>
    </motion.div>
  );
}

/* =========== Discover =========== */
function Discover({
  queue, like, nope, message, filters, setFilters
}: {
  queue: any[]; like: (u: any) => void; nope: (u: any) => void; message: (u: any) => void;
  filters: any; setFilters: (f: any) => void;
}) {
  const user = queue[0];
  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-4 px-4 pb-[180px] md:pb-28">
      <div className="sticky top-0 z-10 -mx-4 px-4 pb-3 bg-gradient-to-b from-white to-transparent">
        <div className="flex items-center gap-2">
          <div className="text-xl font-extrabold tracking-tight flex itemsички gap-2">
            <Flame className="h-5 w-5 text-rose-500" /> LoveLink
          </div>
          <button onClick={() => alert("Скоро: speed chatting вечер, 20:00 (демо)")}
                  className="ml-auto px-3 py-1.5 rounded-full border text-xs">Събития</button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 md:max-w-lg">
          <select className="px-3 py-2 rounded-xl border text-sm" value={filters.gender || ""}
                  onChange={e => setFilters((f: any) => ({ ...f, gender: e.target.value }))}>
            <option value="">Пол</option><option>Мъж</option><option>Жена</option>
          </select>
          <input type="text" placeholder="Град" value={filters.city || ""}
                 onChange={e => setFilters((f: any) => ({ ...f, city: e.target.value }))}
                 className="px-3 py-2 rounded-xl border text-sm" />
          <select className="px-3 py-2 rounded-xl border text-sm" value={filters.zodiac || ""}
                  onChange={e => setFilters((f: any) => ({ ...f, zodiac: e.target.value }))}>
            <option value="">Зодия</option>
            {["Овен","Телец","Близнаци","Рак","Лъв","Дева","Везни","Скорпион","Стрелец","Козирог","Водолей","Риби"]
              .map(z => (<option key={z}>{z}</option>))}
          </select>
        </div>
      </div>

      <div className="mt-2 relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-50 via-white to-white" />
        <div className="relative">
          {queue.slice(1, 3).map((u, i) => (
            <div key={u.id} className="absolute inset-x-0 top-2 scale-95"
                 style={{ transform: `translateY(${i * 10 + 6}px)`, opacity: 0.5 - i * 0.2 }}>
              <div className="h-[60vh] min-h-[420px] rounded-[28px] overflow-hidden border bg-neutral-100" />
            </div>
          ))}
          {user ? (
            <SwipeCard user={user} onLike={like} onNope={nope} onMessage={message} />
          ) : (
            <div className="h-[60vh] min-h-[420px] rounded-[28px] border grid place-items-center text-neutral-500">
              Няма повече профили по тези филтри.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========== Global Chat (демо) =========== */
function GlobalChat({ roomId, me }: { roomId: string; me: any }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const scRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (scRef.current) scRef.current.scrollTop = scRef.current.scrollHeight; }, [messages]);

  useEffect(() => {
    let stop = false;
    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true })
        .limit(200);
      if (!stop && data) setMessages(data || []);
      const ch = supabase
        .channel(`room:${roomId}`)
        .on("postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
          (payload: any) => setMessages(prev => [...prev, payload.new])
        );
      ch.subscribe();
    })();
  }, [roomId]);

  async function send() {
    const t = text.trim(); if (!t) return; setText("");
    const msg = { id: uid(), room_id: roomId, from_id: me.id, text: t, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, msg]);
    try { await supabase.from("messages").insert(msg); } catch {}
  }

  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-4 px-3 pb-[180px] md:pb-28">
      <div className="text-xl font-bold">Обща чат стая</div>
      <div ref={scRef} className="mt-3 h-[65vh] rounded-3xl border bg-white overflow-y-auto p-3 space-y-3">
        {messages.map((m: any) => (
          <div key={m.id} className={cn("max-w-[82%]", m.from_id === me.id ? "ml-auto" : "")}>
            <div className="text-[10px] text-neutral-500 mb-1">
              {m.from_id === me.id ? "Ти" : "Потребител"} · {new Date(m.created_at).toLocaleTimeString()}
            </div>
            <div className={cn(
              "px-3 py-2 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
              m.from_id === me.id ? "bg-neutral-900 text-white skew-y-[-2deg]" : "bg-neutral-100 skew-y-[2deg]"
            )}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input value={text} onChange={e => setText(e.target.value)}
               onKeyDown={e => e.key === "Enter" && send()}
               placeholder="Напиши нещо мило…" className="flex-1 px-4 py-3 rounded-2xl border" />
        <button onClick={send} className="h-12 w-12 rounded-2xl grid place-items-center bg-neutral-900 text-white">
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/* =========== Profile (демо редакция) =========== */
function Profile({ me, setMe }: { me: any; setMe: (v: any) => void }) {
  const [flipped, setFlipped] = useState(false);
  const [bio, setBio] = useState(me.bio || "");
  const [interests, setInterests] = useState((me.interests || []).join(", "));

  async function save() {
    const updated = { ...me, bio, interests: interests.split(",").map(x => x.trim()).filter(Boolean) };
    setMe(updated);
    try { await supabase.from("profiles").upsert(updated); } catch {}
  }
  async function logout() {
    await supabase.auth.signOut();
    window.location.replace(import.meta.env.BASE_URL || "/");
  }

  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-4 px-4 pb-[180px] md:pb-28">
      <div className="flex items-center gap-2">
        <UserRound className="h-5 w-5" /><div className="text-xl font-bold">Моят профил</div>
        <button onClick={logout} className="ml-auto text-xs px-2 py-1 rounded-xl border flex items-center gap-1">
          <LogOut className="h-3.5 w-3.5" /> Изход
        </button>
      </div>
      <div className="mt-3" style={{ perspective: "1200px" }}>
        <div className="relative h-[56vh] min-h-[380px] rounded-[28px] border overflow-hidden shadow-xl"
             style={{ transformStyle: "preserve-3d", transform: `rotateY(${flipped ? 180 : 0}deg)`, transition: "transform 400ms" }}>
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
            <img src={me.photos?.[0]} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
            <div className="absolute bottom-0 p-4 text-white">
              <div className="text-2xl font-extrabold">{me.name}, {me.age}</div>
              <div className="text-sm text-white/90">{me.city} · {me.zodiac}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {(me.interests || []).slice(0, 4).map((i: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 rounded-full text-xs bg-white/80 text-neutral-800">{i}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-white p-4"
               style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
            <div className="text-sm text-neutral-500">Редакция</div>
            <label className="block mt-2 text-xs text-neutral-500">Био</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} className="mt-1 w-full border rounded-xl p-3" rows={4} />
            <label className="block mt-3 text-xs text-neutral-500">Интереси (разделени със запетая)</label>
            <input value={interests} onChange={e => setInterests(e.target.value)} className="mt-1 w-full border rounded-xl p-3" />
            <div className="mt-4 flex gap-2">
              <button onClick={() => setFlipped(false)} className="px-4 py-2 rounded-xl border">Назад</button>
              <button onClick={() => { save(); setFlipped(false); }}
                      className="px-4 py-2 rounded-xl bg-neutral-900 text-white">Запази</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========== Планове / монети (демо) =========== */
function Plans({
  coins, setCoins, plan, setPlan,
}: {
  coins: number; setCoins: (fn: any) => void; plan: string; setPlan: (p: string) => void;
}) {
  const packs = [
    { amt: 50, price: "4.99 лв" },
    { amt: 100, price: "7.99 лв" },
    { amt: 150, price: "10.99 лв" },
  ];
  const subs = [
    { k: "Lite", period: "дневен", price: "2.49 лв/ден", perks: ["Без реклами", "1 Boost", "'Кой ме хареса' (огр.)"] },
    { k: "Plus", period: "седмичен", price: "9.99 лв/седмица", perks: ["Неогр. DM към приятели", "3 Boost-а", "Пренавиване"] },
    { k: "Premium", period: "месечен", price: "24.99 лв/месец", perks: ["Всички харесали те", "Анонимно разглеждане", "Про филтри"] },
  ];

  async function addCoins(amt: number) {
    setCoins((c: number) => c + amt);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const myId = userData?.user?.id;
      if (myId) await supabase.from("coin_ledger").insert({ id: uid(), user_id: myId, delta: amt, reason: "purchase" });
    } catch {}
    alert(`Добавени са ${amt} монети (демо).`);
  }

  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-4 px-4 pb-[180px] md:pb-28">
      <div className="text-xl font-bold">Монети и абонаменти</div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {packs.map(p => (
          <div key={p.amt} className="relative p-3 rounded-2xl border bg-white text-center shadow-sm">
            <div className="mx-auto h-14 w-14 rounded-full grid place-items-center"
                 style={{
                   background: "radial-gradient(circle at 30% 30%, #fff7d6, #f5d34f 50%, #c99a16)",
                   boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.08)"
                 }}>
              <Coins className="h-6 w-6" />
            </div>
            <div className="mt-2 text-2xl font-extrabold">{p.amt}</div>
            <div className="text-xs text-neutral-500">монети</div>
            <div className="mt-1 text-sm">{p.price}</div>
            <button onClick={() => addCoins(p.amt)} className="mt-2 w-full px-3 py-2 rounded-xl bg-neutral-900 text-white">Купи</button>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {subs.map(s => (
          <div key={s.k} className={cn("p-4 rounded-2xl border bg-white shadow-sm", plan === s.k && "ring-2 ring-rose-400")}>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" /><div className="font-semibold">{s.k}</div>
              <div className="ml-auto text-sm text-neutral-600">{s.period}</div>
            </div>
            <div className="mt-1 text-neutral-800">{s.price}</div>
            <ul className="mt-2 space-y-1 text-sm text-neutral-600 list-disc ml-5">
              {s.perks.map((p, i) => (<li key={i}>{p}</li>))}
            </ul>
            <button onClick={() => setPlan(s.k)} className="mt-3 w-full px-4 py-2 rounded-xl bg-rose-500 text-white">Избери</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========== Навигация =========== */
function TabBar({ tab, setTab, coins, plan }: {
  tab: string; setTab: (t: string) => void; coins: number; plan: string;
}) {
  const tabs = [
    { k: "discover", label: "Открий", icon: MessageCircle },
    { k: "chat",     label: "Чат",    icon: MessageCircle },
    { k: "profile",  label: "Профил", icon: UserRound },
    { k: "plans",    label: "Планове",icon: Crown },
  ];
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/80 backdrop-blur border-t border-neutral-200">
      <div className="max-w-md mx-auto px-3 py-2 flex items-center gap-2">
        {tabs.map(t => {
          const Icon = t.icon as any;
          const active = tab === t.k;
          return (
            <button key={t.k} onClick={() => setTab(t.k)}
                    className={cn("flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl",
                                  active && "bg-neutral-900 text-white")}>
              <Icon className="h-5 w-5" /><span className="text-[11px] leading-none">{t.label}</span>
            </button>
          );
        })}
      </div>
      <div className="max-w-md mx-auto px-4 pb-2 flex items-center justify-between text-xs text-neutral-600">
        <div className="flex items-center gap-1"><Coins className="h-4 w-4" /> Монети: <b className="ml-1">{coins}</b></div>
        <div>{plan ? `План: ${plan}` : "Без план"}</div>
      </div>
    </div>
  );
}

function TopTabs({ tab, setTab, coins, plan }: {
  tab: string; setTab: (t: string) => void; coins: number; plan: string;
}) {
  const tabs = [
    { k: "discover", label: "Открий" },
    { k: "chat",     label: "Чат" },
    { k: "profile",  label: "Профил" },
    { k: "plans",    label: "Планове" },
  ];
  return (
    <div className="hidden md:block bg-white/70 backdrop-blur border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2">
        {tabs.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
                  className={cn("px-3 py-1.5 rounded-xl text-sm",
                                tab === t.k ? "bg-neutral-900 text-white" : "hover:bg-neutral-100")}>
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 text-sm">
          <div className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Coins className="h-4 w-4" />Монети: <b className="ml-1">{coins}</b>
          </div>
          <div className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">{plan ? `План: ${plan}` : "Без план"}</div>
        </div>
      </div>
    </div>
  );
}

/* =========== App =========== */
export default function LoveLinkMVP() {
  const [tab, setTab] = useState("discover");
  const [me, setMe] = useState<any | null>(null);
  const [coins, setCoins] = useState<number>(() => Number(localStorage.getItem("ll_coins") || "25"));
  const [plan, setPlan]   = useState<string>(() => localStorage.getItem("ll_plan") || "");
  const [filters, setFilters] = useState<any>({ gender: "", city: "", zodiac: "" });
  const [queue, setQueue] = useState<any[]>([]);
  const [activePeer, setActivePeer] = useState<any | null>(null);

  // PWA SW
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register((import.meta.env.BASE_URL || "/") + "ll-sw.js").catch(() => {});
    }
  }, []);

  // Довършване на PKCE при връщане (и чистене на query-то)
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("code")) {
      supabase.auth.exchangeCodeForSession(window.location.href).finally(() => {
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        url.searchParams.delete("error");
        url.searchParams.delete("error_description");
        window.history.replaceState({}, "", url.toString());
      });
    }
  }, []);

  // Сесия + реакция на промяна на auth състоянието
  useEffect(() => {
    let mounted = true;

    async function setFromSession(session: Session | null) {
      if (!mounted) return;
      if (session?.user) {
        const user = session.user;
        try {
          const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
          setMe(
            data || {
              id: user.id,
              name: user.email?.split("@")[0] || "Потребител",
              photos: DEMO_USERS[0].photos,
              age: 28, gender: "", zodiac: "", city: "", interests: [], bio: "",
            }
          );
        } catch {
          setMe({
            id: user.id,
            name: user.email?.split("@")[0] || "Потребител",
            photos: DEMO_USERS[0].photos,
            age: 28, gender: "", zodiac: "", city: "", interests: [], bio: "",
          });
        }
      } else {
        setMe(null);
      }
    }

    supabase.auth.getSession().then(({ data }) => setFromSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setFromSession(session));
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => { localStorage.setItem("ll_coins", String(coins)); }, [coins]);
  useEffect(() => { if (plan) localStorage.setItem("ll_plan", plan); }, [plan]);

  usePresence(me || {});

  // Зареждане на профили
  useEffect(() => {
    (async () => {
      const query = supabase.from("profiles").select("*").limit(50);
      if (filters.gender) (query as any).eq("gender", filters.gender);
      if (filters.city)   (query as any).ilike("city", `%${filters.city}%`);
      if (filters.zodiac) (query as any).eq("zodiac", filters.zodiac);
      const { data } = await (query as any);
      if (data && data.length) setQueue(data);
      else {
        setQueue(
          DEMO_USERS.filter((u) =>
            (!filters.gender || u.gender === filters.gender) &&
            (!filters.city || u.city.toLowerCase().includes(String(filters.city).toLowerCase())) &&
            (!filters.zodiac || u.zodiac === filters.zodiac)
          )
        );
      }
    })();
  }, [filters]);

  // Действия
  async function like(u: any) {
    setQueue((q) => q.slice(1));
    try { if (me?.id) await supabase.from("likes").insert({ id: uid(), from_id: me.id, to_id: u.id }); } catch {}
    try {
      if (me?.id) {
        const { data } = await supabase.from("likes").select("id").eq("from_id", u.id).eq("to_id", me.id).limit(1);
        if (data && data.length) alert(`It's a match! Ти и ${u.name} се харесахте.`);
      }
    } catch {}
  }
  function nope(u: any) { setQueue((q) => q.slice(1)); }
  function message(u: any) { setTab("chat"); setActivePeer(u); }

  if (!me) return <AuthGate setMe={setMe} />;

  const current = queue[0];

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#fff6f7,#eef3ff)] text-neutral-900">
      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2">
          <Star className="h-5 w-5 text-rose-500" />
          <div className="text-sm">Здравей, <b>{me.name}</b>!</div>
          <div className="ml-auto text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{plan || "Без план"}</div>
        </div>
      </div>

      <TopTabs tab={tab} setTab={setTab} coins={coins} plan={plan} />

      {tab === "discover" && (
        <Discover queue={queue} like={like} nope={nope} message={message} filters={filters} setFilters={setFilters} />
      )}
      {tab === "chat" && (activePeer ? <DirectChat me={me} peer={activePeer} /> : <GlobalChat me={me} roomId="global" />)}
      {tab === "profile" && <Profile me={me} setMe={setMe} />}
      {tab === "plans" && <Plans coins={coins} setCoins={setCoins as any} plan={plan} setPlan={setPlan} />}

      <ActionDock
        visible={tab === "discover" && !!current}
        onDislike={() => current && nope(current)}
        onMessage={() => current && message(current)}
        onLike={() => current && like(current)}
      />

      <TabBar tab={tab} setTab={setTab} coins={coins} plan={plan} />

      <footer className="mt-16 py-8 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} LoveLink · Supabase · OAuth (Google/PKCE) · PWA-ready
      </footer>
    </div>
  );
}

/* =========== Direct Chat (прост) =========== */
function DirectChat({ me, peer }: { me: any; peer: any }) {
  const roomId = useMemo(() => [me.id, peer.id].sort().join("::"), [me.id, peer.id]);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const scRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (scRef.current) scRef.current.scrollTop = scRef.current.scrollHeight; }, [messages]);

  useEffect(() => {
    let stop = false;
    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true })
        .limit(200);
      if (!stop && data) setMessages(data || []);
      const ch = supabase
        .channel(`dm:${roomId}`)
        .on("postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
          (payload: any) => setMessages(prev => [...prev, payload.new])
        );
      ch.subscribe();
    })();
  }, [roomId]);

  async function send() {
    const t = text.trim(); if (!t) return; setText("");
    const msg = { id: uid(), room_id: roomId, from_id: me.id, to_id: peer.id, text: t, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, msg]);
    try { await supabase.from("messages").insert(msg); } catch {}
  }

  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-4 px-3 pb-[180px] md:pb-28">
      <div className="flex items-center gap-2"><UserRound className="h-5 w-5" /><div className="text-xl font-bold">Чат с {peer.name}</div></div>
      <div ref={scRef} className="mt-3 h-[65vh] rounded-3xl border bg-white overflow-y-auto p-3 space-y-3">
        {messages.map((m: any) => (
          <div key={m.id} className={cn("max-w-[82%]", m.from_id === me.id ? "ml-auto" : "")}>
            <div className="text-[10px] text-neutral-500 mb-1">
              {m.from_id === me.id ? "Ти" : peer.name} · {new Date(m.created_at).toLocaleTimeString()}
            </div>
            <div className={cn(
              "px-3 py-2 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
              m.from_id === me.id ? "bg-neutral-900 text-white skew-y-[-2deg]" : "bg-neutral-100 skew-y-[2deg]"
            )}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input value={text} onChange={e => setText(e.target.value)} placeholder={`До ${peer.name}…`}
               className="flex-1 px-4 py-3 rounded-2xl border" />
        <button onClick={send} className="h-12 w-12 rounded-2xl grid place-items-center bg-neutral-900 text-white">
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
