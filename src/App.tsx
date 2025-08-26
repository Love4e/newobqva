// src/App.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Users, MessageCircle, UserRound, Crown, Coins,
  Heart, X, LogOut, Star
} from "lucide-react";

/* ============================
   Supabase
   ============================ */
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://YOUR.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR-ANON-KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// коректен redirect за GitHub Pages (напр. /lovelink-mvp/)
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "/");

/* ============================
   Демо профили (fallback)
   ============================ */
const DEMO: any[] = [
  {
    id: "d1",
    display_name: "Ива",
    age: 27,
    city: "София",
    zodiac: "Везни",
    interests: ["йога", "кино", "планина"],
    bio: "Вярвам в добрия разговор и спонтанните пътувания.",
    avatar_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "d2",
    display_name: "Алекс",
    age: 31,
    city: "Пловдив",
    zodiac: "Лъв",
    interests: ["тех", "фитнес", "музика"],
    bio: "Front-end ентусиаст и фен на пътуванията.",
    avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "d3",
    display_name: "Мария",
    age: 22,
    city: "Варна",
    zodiac: "Риби",
    interests: ["изкуство", "книги", "йога"],
    bio: "Морско момиче с голяма библиотека и любопитство.",
    avatar_url:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
    ],
  },
];

/* ============================
   Общи помощници
   ============================ */
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const uid = () => crypto?.randomUUID?.() || Math.random().toString(36).slice(2);

/* ============================
   Auth (само Google)
   ============================ */
function AuthGate({ onReady }: { onReady: (me: any) => void }) {
  const [err, setErr] = useState("");

  async function signInGoogle() {
    try {
      setErr("");
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + BASE,
          queryParams: {
            // по-тих прозорец
            prompt: "select_account",
          },
        },
      });
    } catch (e: any) {
      setErr(e.message || String(e));
    }
  }

  // ако вече има сесия – вземи/създай профил
  useEffect(() => {
    (async () => {
      try {
        const { data: s } = await supabase.auth.getSession();
        const user = s?.session?.user;
        if (!user) return;
        const baseName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "User";

        const prof = {
          id: user.id,
          display_name: baseName,
          avatar_url: user.user_metadata?.picture || null,
          age: null,
          city: "",
          zodiac: "",
          interests: [],
          bio: "",
          updated_at: new Date().toISOString(),
        };

        // upsert (създава ако няма)
        try {
          await supabase.from("profiles").upsert(prof);
        } catch {
          // ако таблицата липсва – игнорирай, ще работим само с демо
        }

        // опитай да прочетеш записа
        let me = prof;
        try {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          if (data) me = data;
        } catch {}

        onReady(me);
      } catch (e: any) {
        setErr(e.message || String(e));
      }
    })();
  }, [onReady]);

  return (
    <div className="min-h-screen grid place-items-center bg-[radial-gradient(ellipse_at_top,_#ffe4ea,_#eef3ff)] p-6">
      <div className="w-full max-w-sm bg-white/80 border rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-rose-500" />
          <div className="text-xl font-extrabold">LoveLink</div>
        </div>
        <div className="mt-2 text-sm text-neutral-600">Вход с Google</div>
        <button
          onClick={signInGoogle}
          className="mt-4 w-full px-4 py-3 rounded-2xl bg-neutral-900 text-white"
        >
          Влез с Google
        </button>
        {err && <div className="mt-3 text-sm text-rose-600">{err}</div>}
      </div>
    </div>
  );
}

/* ============================
   Карта със swipe
   ============================ */
function SwipeCard({
  user,
  onLike,
  onNope,
}: {
  user: any;
  onLike: (u: any) => void;
  onNope: (u: any) => void;
}) {
  const x = useMotionValue(0);
  const rot = useTransform(x, [-150, 0, 150], [-12, 0, 12]);
  return (
    <motion.div
      className="relative h-[68vh] min-h-[440px] rounded-[28px] overflow-hidden shadow-2xl border bg-neutral-900"
      style={{ x, rotate: rot }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={(e, info) => {
        const t = 120;
        if (info.offset.x > t) onLike(user);
        else if (info.offset.x < -t) onNope(user);
        else x.set(0);
      }}
    >
      <img
        src={user.photos?.[0] || user.avatar_url}
        alt={user.display_name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/60" />
      <div className="absolute bottom-0 w-full p-4">
        <div className="text-white text-2xl font-extrabold drop-shadow">
          {user.display_name}
          {user.age ? `, ${user.age}` : ""}
        </div>
        <div className="text-white/90">{user.city} {user.zodiac && `· ${user.zodiac}`}</div>
        {user.bio && (
          <div className="mt-2 text-white/90 text-sm drop-shadow">{user.bio}</div>
        )}
      </div>
    </motion.div>
  );
}

function Discover({
  queue,
  like,
  nope,
}: {
  queue: any[];
  like: (u: any) => void;
  nope: (u: any) => void;
}) {
  const u = queue[0];
  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto pt-4 px-4 pb-[160px]">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <div className="text-xl font-bold">Открий</div>
      </div>
      <div className="mt-3 relative">
        {u ? (
          <SwipeCard user={u} onLike={like} onNope={nope} />
        ) : (
          <div className="h-[60vh] rounded-[28px] border grid place-items-center text-neutral-500">
            Няма повече профили.
          </div>
        )}
      </div>
      {/* Долни бутони */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-[calc(88px+env(safe-area-inset-bottom)+12px)] md:bottom-6 z-40">
        <div className="flex items-center gap-5">
          <CircleBtn label="Не" className="bg-white text-gray-800" onClick={() => u && nope(u)}>
            <X className="h-6 w-6" />
          </CircleBtn>
          <CircleBtn label="Да" className="bg-rose-500 text-white" onClick={() => u && like(u)}>
            <Heart className="h-6 w-6" />
          </CircleBtn>
        </div>
      </div>
    </div>
  );
}

function CircleBtn({
  children,
  label,
  className,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "size-14 sm:size-16 rounded-full grid place-items-center shadow-2xl border",
        className
      )}
      aria-label={label}
      title={label}
    >
      {children}
    </motion.button>
  );
}

/* ============================
   Чат (демо – само локален списък,
   без изискване към таблици)
   ============================ */
function GlobalChat({ me }: { me: any }) {
  const [text, setText] = useState("");
  const [list, setList] = useState<any[]>([]);
  const scRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scRef.current) scRef.current.scrollTop = scRef.current.scrollHeight;
  }, [list]);

  async function send() {
    const t = text.trim();
    if (!t) return;
    setText("");
    const msg = {
      id: uid(),
      from_id: me.id || "me",
      text: t,
      created_at: new Date().toISOString(),
    };
    setList((p) => [...p, msg]);
    // опит за съхранение – безопасно
    try {
      await supabase.from("messages").insert({
        id: msg.id,
        room_id: "global",
        from_id: msg.from_id,
        text: msg.text,
        created_at: msg.created_at,
      });
    } catch {}
  }

  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto pt-4 px-4 pb-[120px]">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <div className="text-xl font-bold">Обща стая (демо)</div>
      </div>
      <div
        ref={scRef}
        className="mt-3 h-[60vh] rounded-3xl border bg-white overflow-y-auto p-3 space-y-3"
      >
        {list.map((m) => (
          <div key={m.id} className="max-w-[80%] ml-auto">
            <div className="text-[10px] text-neutral-500 mb-1">
              Ти · {new Date(m.created_at).toLocaleTimeString()}
            </div>
            <div className="px-3 py-2 rounded-2xl bg-neutral-900 text-white">
              {m.text}
            </div>
          </div>
        ))}
        {!list.length && (
          <div className="text-sm text-neutral-500">Напиши първото съобщение…</div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl border"
          placeholder="Здравейте! 🙂"
        />
        <button
          onClick={send}
          className="h-12 w-12 rounded-2xl grid place-items-center bg-neutral-900 text-white"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/* ============================
   Профил (редакция)
   ============================ */
function Profile({ me, setMe }: { me: any; setMe: (x: any) => void }) {
  const [displayName, setDisplayName] = useState(me.display_name || "");
  const [age, setAge] = useState(me.age || "");
  const [city, setCity] = useState(me.city || "");
  const [zodiac, setZodiac] = useState(me.zodiac || "");
  const [bio, setBio] = useState(me.bio || "");
  const [interests, setInterests] = useState((me.interests || []).join(", "));

  async function save() {
    const updated = {
      ...me,
      display_name: displayName || "User",
      age: age ? Number(age) : null,
      city,
      zodiac,
      bio,
      interests: interests
        .split(",")
        .map((x: string) => x.trim())
        .filter(Boolean),
      updated_at: new Date().toISOString(),
    };
    setMe(updated);
    try {
      await supabase.from("profiles").upsert(updated);
    } catch {}
  }

  async function logout() {
    try {
      await supabase.auth.signOut();
    } catch {}
    window.location.href = BASE; // чисто връщане
  }

  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto pt-4 px-4 pb-[120px]">
      <div className="flex items-center gap-2">
        <UserRound className="h-5 w-5" />
        <div className="text-xl font-bold">Моят профил</div>
        <button
          onClick={logout}
          className="ml-auto text-xs px-2 py-1 rounded-xl border flex items-center gap-1"
        >
          <LogOut className="h-3.5 w-3.5" /> Изход
        </button>
      </div>

      <div className="mt-3 rounded-[28px] border overflow-hidden">
        <div className="relative h-[42vh] min-h-[300px] bg-neutral-100">
          <img
            src={me.avatar_url || me.photos?.[0]}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 p-4 text-white bg-gradient-to-t from-black/60 via-black/20 to-transparent w-full">
            <div className="text-2xl font-extrabold">
              {me.display_name}
              {me.age ? `, ${me.age}` : ""}
            </div>
            <div className="text-sm text-white/90">
              {me.city} {me.zodiac && `· ${me.zodiac}`}
            </div>
          </div>
        </div>
        <div className="p-4 bg-white">
          <div className="grid gap-3">
            <Input label="Име" value={displayName} onChange={setDisplayName} />
            <Input label="Години" value={age} onChange={setAge} type="number" />
            <Input label="Град" value={city} onChange={setCity} />
            <Select
              label="Зодия"
              value={zodiac}
              onChange={setZodiac}
              options={[
                "",
                "Овен",
                "Телец",
                "Близнаци",
                "Рак",
                "Лъв",
                "Дева",
                "Везни",
                "Скорпион",
                "Стрелец",
                "Козирог",
                "Водолей",
                "Риби",
              ]}
            />
            <TextArea label="Био" value={bio} onChange={setBio} rows={3} />
            <Input
              label="Интереси (раздели със запетая)"
              value={interests}
              onChange={setInterests}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={save} className="px-4 py-2 rounded-xl bg-neutral-900 text-white">
              Запази
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* малки UI елементи */
function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs text-neutral-500">{label}</div>
      <input
        value={value ?? ""}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded-xl p-3"
      />
    </label>
  );
}
function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <div className="text-xs text-neutral-500">{label}</div>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded-xl p-3"
      />
    </label>
  );
}
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <div className="text-xs text-neutral-500">{label}</div>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded-xl p-3"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "—"}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ============================
   Планове/Монети (локално)
   ============================ */
function Plans({
  coins,
  setCoins,
  plan,
  setPlan,
}: {
  coins: number;
  setCoins: (fn: any) => void;
  plan: string;
  setPlan: (p: string) => void;
}) {
  const packs = [
    { amt: 50, price: "4.99 лв" },
    { amt: 100, price: "7.99 лв" },
    { amt: 150, price: "10.99 лв" },
  ];
  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto pt-4 px-4 pb-[120px]">
      <div className="flex items-center gap-2">
        <Crown className="h-5 w-5" />
        <div className="text-xl font-bold">Планове и монети</div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {packs.map((p) => (
          <div
            key={p.amt}
            className="p-3 rounded-2xl border bg-white text-center shadow-sm"
          >
            <div className="mx-auto h-12 w-12 rounded-full grid place-items-center bg-yellow-200">
              <Coins className="h-6 w-6" />
            </div>
            <div className="mt-2 text-2xl font-extrabold">{p.amt}</div>
            <div className="text-xs text-neutral-500">монети</div>
            <div className="mt-1 text-sm">{p.price}</div>
            <button
              onClick={() => setCoins((c: number) => c + p.amt)}
              className="mt-2 w-full px-3 py-2 rounded-xl bg-neutral-900 text-white"
            >
              Купи
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {["Lite", "Plus", "Premium"].map((k) => (
          <button
            key={k}
            onClick={() => setPlan(k)}
            className={cn(
              "p-4 rounded-2xl border bg-white text-left",
              plan === k && "ring-2 ring-rose-400"
            )}
          >
            <div className="font-semibold">{k}</div>
            <div className="text-sm text-neutral-600 mt-1">
              Демонстрационен абонамент
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================
   Навигация
   ============================ */
function TabBar({
  tab,
  setTab,
  coins,
  plan,
}: {
  tab: string;
  setTab: (t: string) => void;
  coins: number;
  plan: string;
}) {
  const tabs = [
    { k: "discover", label: "Открий", icon: Users },
    { k: "chat", label: "Чат", icon: MessageCircle },
    { k: "profile", label: "Профил", icon: UserRound },
    { k: "plans", label: "Планове", icon: Crown },
  ];
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/80 backdrop-blur border-t border-neutral-200">
      <div className="max-w-md mx-auto px-3 py-2 flex items-center gap-2">
        {tabs.map((t) => {
          const Icon = t.icon as any;
          const active = tab === t.k;
          return (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl",
                active && "bg-neutral-900 text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[11px] leading-none">{t.label}</span>
            </button>
          );
        })}
      </div>
      <div className="max-w-md mx-auto px-4 pb-2 flex items-center justify-between text-xs text-neutral-600">
        <div className="flex items-center gap-1">
          <Coins className="h-4 w-4" /> Монети: <b className="ml-1">{coins}</b>
        </div>
        <div>{plan ? `План: ${plan}` : "Без план"}</div>
      </div>
    </div>
  );
}

/* ============================
   Приложение
   ============================ */
export default function App() {
  const [me, setMe] = useState<any | null>(null);
  const [tab, setTab] = useState("discover");
  const [coins, setCoins] = useState<number>(() =>
    Number(localStorage.getItem("ll_coins") || "25")
  );
  const [plan, setPlan] = useState<string>(() => localStorage.getItem("ll_plan") || "");
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => localStorage.setItem("ll_coins", String(coins)), [coins]);
  useEffect(() => localStorage.setItem("ll_plan", plan), [plan]);

  // след логин – дръпни профили
  useEffect(() => {
    if (!me) return;

    (async () => {
      try {
        // опитай да вземеш реални профили
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", me.id)
          .limit(50);
        if (data?.length) setQueue(data);
        else setQueue(DEMO);
      } catch {
        setQueue(DEMO);
      }
    })();
  }, [me?.id]);

  function like(u: any) {
    setQueue((q) => q.slice(1));
    // по желание: запис в likes (безопасно)
    (async () => {
      try {
        if (!me?.id) return;
        await supabase.from("likes").insert({ id: uid(), from_id: me.id, to_id: u.id });
      } catch {}
    })();
  }
  function nope(u: any) {
    setQueue((q) => q.slice(1));
  }

  if (!me) return <AuthGate onReady={setMe} />;

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#fff6f7,#eef3ff)] text-neutral-900">
      {/* горна лента */}
      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2">
          <Star className="h-5 w-5 text-rose-500" />
          <div className="text-sm">
            Здравей, <b>{me.display_name || "Потребител"}</b>!
          </div>
          <div className="ml-auto text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
            {plan || "Без план"}
          </div>
        </div>
      </div>

      {/* съдържание */}
      {tab === "discover" && <Discover queue={queue} like={like} nope={nope} />}
      {tab === "chat" && <GlobalChat me={me} />}
      {tab === "profile" && <Profile me={me} setMe={setMe} />}
      {tab === "plans" && (
        <Plans coins={coins} setCoins={setCoins as any} plan={plan} setPlan={setPlan} />
      )}

      {/* таб бар */}
      <TabBar tab={tab} setTab={setTab} coins={coins} plan={plan} />

      <footer className="mt-16 py-10 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} LoveLink · Google OAuth · Supabase Ready
      </footer>
    </div>
  );
}
