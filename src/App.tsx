// src/App.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Heart, X, MessageCircle, UserRound, Coins, Crown,
  Flame, Star, Loader2, LogOut
} from "lucide-react";

/* =====================================================
   LoveLink — ЧИСТА ДЕМО ВЕРСИЯ (НЯМА вход / Supabase)
   Всичко е локално, за да се билдва и стартира без грешки.
   ===================================================== */

type User = {
  id: string;
  name: string;
  age: number;
  gender: string;
  zodiac: string;
  city: string;
  interests: string[];
  bio: string;
  photos: string[];
  online?: boolean;
};

const DEMO_USERS: User[] = [
  {
    id: "u1",
    name: "Ива",
    age: 27,
    gender: "Жена",
    zodiac: "Везни",
    city: "София",
    interests: ["йога", "кино", "планина"],
    bio: "Вярвам в добрия разговор и спонтанните пътувания.",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    ],
    online: true,
  },
  {
    id: "u2",
    name: "Алекс",
    age: 31,
    gender: "Мъж",
    zodiac: "Лъв",
    city: "Пловдив",
    interests: ["тех", "фитнес", "музика"],
    bio: "Front-end ентусиаст и фен на пътуванията.",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    ],
    online: true,
  },
  {
    id: "u3",
    name: "Мария",
    age: 22,
    gender: "Жена",
    zodiac: "Риби",
    city: "Варна",
    interests: ["изкуство", "книги", "йога"],
    bio: "Морско момиче с голяма библиотека и любопитство.",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
    ],
    online: false,
  },
];

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const uid = () =>
  (crypto as any)?.randomUUID?.() || Math.random().toString(36).slice(2);

/* =============================
   Action Dock (мобилни бутони)
   ============================= */
function ActionDock({
  visible,
  onDislike,
  onMessage,
  onLike,
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
        <DockBtn
          label="Откажи"
          className="bg-white text-gray-700 ring-1 ring-black/10"
          onClick={onDislike}
        >
          <X className="h-6 w-6" />
        </DockBtn>
        <DockBtn
          label="Съобщение"
          className="bg-amber-400 text-white ring-1 ring-black/10"
          onClick={onMessage}
        >
          <MessageCircle className="h-6 w-6" />
        </DockBtn>
        <DockBtn
          label="Харесай"
          className="bg-rose-500 text-white ring-1 ring-black/10"
          onClick={onLike}
        >
          <Heart className="h-6 w-6" />
        </DockBtn>
      </div>
    </div>
  );
}
function DockBtn({
  children,
  label,
  className = "",
  onClick,
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

/* =========== Swipe Card =========== */
function SwipeCard({
  user,
  onLike,
  onNope,
  onMessage,
}: {
  user: User;
  onLike: (u: User) => void;
  onNope: (u: User) => void;
  onMessage: (u: User) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);
  const opacityRight = useTransform(x, [50, 120], [0, 1]);
  const opacityLeft = useTransform(x, [-120, -50], [1, 0]);

  return (
    <motion.div
      className="relative h-[68vh] min-h-[440px] rounded-[28px] overflow-hidden shadow-2xl border bg-neutral-900"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={(_e, info) => {
        const t = 120;
        if (info.offset.x > t) onLike(user);
        else if (info.offset.x < -t) onNope(user);
        else x.set(0);
      }}
    >
      <img
        src={user.photos?.[0]}
        alt={user.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/60" />
      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 text-white text-xs">
        {user.city} · {user.zodiac}
      </div>
      <div className="absolute bottom-0 w-full p-4">
        <div className="text-white text-2xl font-extrabold drop-shadow">
          {user.name}, {user.age}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {(user.interests || [])
            .slice(0, 4)
            .map((i: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full text-xs bg-white/80 text-neutral-800"
              >
                {i}
              </span>
            ))}
        </div>
        <div className="mt-2 text-white/90 text-sm drop-shadow">{user.bio}</div>
      </div>

      <motion.div
        style={{ opacity: opacityRight }}
        className="absolute top-5 right-5 px-3 py-1.5 rounded-xl bg-emerald-500/90 text-white text-sm"
      >
        LIKE
      </motion.div>
      <motion.div
        style={{ opacity: opacityLeft }}
        className="absolute top-5 left-5 px-3 py-1.5 rounded-xl bg-rose-500/90 text-white text-sm"
      >
        NOPE
      </motion.div>
    </motion.div>
  );
}

/* =========== Discover =========== */
function Discover({
  queue,
  like,
  nope,
  message,
  filters,
  setFilters,
}: {
  queue: User[];
  like: (u: User) => void;
  nope: (u: User) => void;
  message: (u: User) => void;
  filters: any;
  setFilters: (f: any) => void;
}) {
  const user = queue[0];
  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-4 px-4 pb-[180px] md:pb-28">
      <div className="sticky top-0 z-10 -mx-4 px-4 pb-3 bg-gradient-to-b from-white to-transparent">
        <div className="flex items-center gap-2">
          <div className="text-xl font-extrabold tracking-tight flex items-center gap-2">
            <Flame className="h-5 w-5 text-rose-500" /> LoveLink
          </div>
          <button
            onClick={() => alert("Скоро: speed chatting вечер, 20:00 (демо)")}
            className="ml-auto px-3 py-1.5 rounded-full border text-xs"
          >
            Събития
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 md:max-w-lg">
          <select
            className="px-3 py-2 rounded-xl border text-sm"
            value={filters.gender || ""}
            onChange={(e) =>
              setFilters((f: any) => ({ ...f, gender: e.target.value }))
            }
          >
            <option value="">Пол</option>
            <option>Мъж</option>
            <option>Жена</option>
          </select>
          <input
            type="text"
            placeholder="Град"
            value={filters.city || ""}
            onChange={(e) =>
              setFilters((f: any) => ({ ...f, city: e.target.value }))
            }
            className="px-3 py-2 rounded-xl border text-sm"
          />
          <select
            className="px-3 py-2 rounded-xl border text-sm"
            value={filters.zodiac || ""}
            onChange={(e) =>
              setFilters((f: any) => ({ ...f, zodiac: e.target.value }))
            }
          >
            <option value="">Зодия</option>
            {[
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
            ].map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-2 relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-50 via-white to-white" />
        <div className="relative">
          {queue.slice(1, 3).map((u, i) => (
            <div
              key={u.id}
              className="absolute inset-x-0 top-2 scale-95"
              style={{
                transform: `translateY(${i * 10 + 6}px)`,
                opacity: 0.5 - i * 0.2,
              }}
            >
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

/* =========== Global Chat (демо — локално) =========== */
function GlobalChat({ roomId, me }: { roomId: string; me: User }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<
    { id: string; roomId: string; fromId: string; text: string; createdAt: number }[]
  >([]);
  const scRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scRef.current) scRef.current.scrollTop = scRef.current.scrollHeight;
  }, [messages]);

  function send() {
    const t = text.trim();
    if (!t) return;
    setText("");
    const msg = {
      id: uid(),
      roomId,
      fromId: me.id,
      text: t,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
  }

  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-4 px-3 pb-[180px] md:pb-28">
      <div className="text-xl font-bold">Обща чат стая</div>
      <div
        ref={scRef}
        className="mt-3 h-[65vh] rounded-3xl border bg-white overflow-y-auto p-3 space-y-3"
      >
        {messages.map((m) => (
          <div key={m.id} className={cn("max-w-[82%]", m.fromId === me.id ? "ml-auto" : "")}>
            <div className="text-[10px] text-neutral-500 mb-1">
              {m.fromId === me.id ? "Ти" : "Потребител"} ·{" "}
              {new Date(m.createdAt).toLocaleTimeString()}
            </div>
            <div
              className={cn(
                "px-3 py-2 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
                m.fromId === me.id
                  ? "bg-neutral-900 text-white skew-y-[-2deg]"
                  : "bg-neutral-100 skew-y-[2deg]"
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Напиши нещо мило…"
          className="flex-1 px-4 py-3 rounded-2xl border"
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

/* =========== Direct Chat (демо — локално) =========== */
function DirectChat({ me, peer }: { me: User; peer: User }) {
  const roomId = useMemo(() => [me.id, peer.id].sort().join("::"), [me.id, peer.id]);
  const [messages, setMessages] = useState<
    { id: string; roomId: string; fromId: string; toId: string; text: string; createdAt: number }[]
  >([]);
  const [text, setText] = useState("");
  const scRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scRef.current) scRef.current.scrollTop = scRef.current.scrollHeight;
  }, [messages]);

  function send() {
    const t = text.trim();
    if (!t) return;
    setText("");
    const msg = {
      id: uid(),
      roomId,
      fromId: me.id,
      toId: peer.id,
      text: t,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
  }

  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-4 px-3 pb-[180px] md:pb-28">
      <div className="flex items-center gap-2">
        <UserRound className="h-5 w-5" />
        <div className="text-xl font-bold">Чат с {peer.name}</div>
      </div>
      <div
        ref={scRef}
        className="mt-3 h-[65vh] rounded-3xl border bg-white overflow-y-auto p-3 space-y-3"
      >
        {messages.map((m) => (
          <div key={m.id} className={cn("max-w-[82%]", m.fromId === me.id ? "ml-auto" : "")}>
            <div className="text-[10px] text-neutral-500 mb-1">
              {m.fromId === me.id ? "Ти" : peer.name} ·{" "}
              {new Date(m.createdAt).toLocaleTimeString()}
            </div>
            <div
              className={cn(
                "px-3 py-2 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
                m.fromId === me.id
                  ? "bg-neutral-900 text-white skew-y-[-2deg]"
                  : "bg-neutral-100 skew-y-[2deg]"
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`До ${peer.name}…`}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 px-4 py-3 rounded-2xl border"
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

/* =========== Profile (демо редакция — локално) =========== */
function Profile({ me, setMe }: { me: User; setMe: (v: User) => void }) {
  const [flipped, setFlipped] = useState(false);
  const [bio, setBio] = useState(me.bio || "");
  const [interests, setInterests] = useState((me.interests || []).join(", "));

  function save() {
    const updated = {
      ...me,
      bio,
      interests: interests.split(",").map((x) => x.trim()).filter(Boolean),
    };
    setMe(updated);
    localStorage.setItem("ll_me", JSON.stringify(updated));
    alert("Записано (локално).");
  }
  function logout() {
    // Няма реален логин — просто чистим локалните данни.
    localStorage.removeItem("ll_me");
    window.location.reload();
  }

  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-4 px-4 pb-[180px] md:pb-28">
      <div className="flex items-center gap-2">
        <UserRound className="h-5 w-5" />
        <div className="text-xl font-bold">Моят профил</div>
        <button
          onClick={logout}
          className="ml-auto text-xs px-2 py-1 rounded-xl border flex items-center gap-1"
        >
          <LogOut className="h-3.5 w-3.5" /> Изчисти локални данни
        </button>
      </div>
      <div className="mt-3" style={{ perspective: "1200px" }}>
        <div
          className="relative h-[56vh] min-h-[380px] rounded-[28px] border overflow-hidden shadow-xl"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${flipped ? 180 : 0}deg)`,
            transition: "transform 400ms",
          }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
            <img
              src={me.photos?.[0]}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
            <div className="absolute bottom-0 p-4 text-white">
              <div className="text-2xl font-extrabold">
                {me.name}, {me.age}
              </div>
              <div className="text-sm text-white/90">
                {me.city} · {me.zodiac}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {(me.interests || [])
                  .slice(0, 4)
                  .map((i: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-full text-xs bg-white/80 text-neutral-800"
                    >
                      {i}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div
            className="absolute inset-0 bg-white p-4"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <div className="text-sm text-neutral-500">Редакция</div>
            <label className="block mt-2 text-xs text-neutral-500">Био</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 w-full border rounded-xl p-3"
              rows={4}
            />
            <label className="block mt-3 text-xs text-neutral-500">
              Интереси (разделени със запетая)
            </label>
            <input
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="mt-1 w-full border rounded-xl p-3"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setFlipped(false)}
                className="px-4 py-2 rounded-xl border"
              >
                Назад
              </button>
              <button
                onClick={() => {
                  save();
                  setFlipped(false);
                }}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white"
              >
                Запази
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setFlipped((v) => !v)}
          className="mt-3 px-3 py-2 rounded-xl border text-sm"
        >
          {flipped ? "Виж карта" : "Редакция"}
        </button>
      </div>
    </div>
  );
}

/* =========== Планове / монети (демо) =========== */
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
  const subs = [
    {
      k: "Lite",
      period: "дневен",
      price: "2.49 лв/ден",
      perks: ["Без реклами", "1 Boost", "'Кой ме хареса' (огр.)"],
    },
    {
      k: "Plus",
      period: "седмичен",
      price: "9.99 лв/седмица",
      perks: ["Неогр. DM към приятели", "3 Boost-а", "Пренавиване"],
    },
    {
      k: "Premium",
      period: "месечен",
      price: "24.99 лв/месец",
      perks: ["Всички харесали те", "Анонимно разглеждане", "Про филтри"],
    },
  ];

  function addCoins(amt: number) {
    setCoins((c: number) => c + amt);
    alert(`Добавени са ${amt} монети (демо).`);
  }

  return (
    <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-4 px-4 pb-[180px] md:pb-28">
      <div className="text-xl font-bold">Монети и абонаменти</div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {packs.map((p) => (
          <div key={p.amt} className="relative p-3 rounded-2xl border bg-white text-center shadow-sm">
            <div
              className="mx-auto h-14 w-14 rounded-full grid place-items-center"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #fff7d6, #f5d34f 50%, #c99a16)",
                boxShadow:
                  "inset 0 2px 6px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Coins className="h-6 w-6" />
            </div>
            <div className="mt-2 text-2xl font-extrabold">{p.amt}</div>
            <div className="text-xs text-neutral-500">монети</div>
            <div className="mt-1 text-sm">{p.price}</div>
            <button
              onClick={() => addCoins(p.amt)}
              className="mt-2 w-full px-3 py-2 rounded-xl bg-neutral-900 text-white"
            >
              Купи
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {subs.map((s) => (
          <div
            key={s.k}
            className={cn(
              "p-4 rounded-2xl border bg-white shadow-sm",
              plan === s.k && "ring-2 ring-rose-400"
            )}
          >
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <div className="font-semibold">{s.k}</div>
              <div className="ml-auto text-sm text-neutral-600">{s.period}</div>
            </div>
            <div className="mt-1 text-neutral-800">{s.price}</div>
            <ul className="mt-2 space-y-1 text-sm text-neutral-600 list-disc ml-5">
              {s.perks.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <button
              onClick={() => setPlan(s.k)}
              className="mt-3 w-full px-4 py-2 rounded-xl bg-rose-500 text-white"
            >
              Избери
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========== Навигация =========== */
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
    { k: "discover", label: "Открий", icon: MessageCircle },
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

function TopTabs({
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
    { k: "discover", label: "Открий" },
    { k: "chat", label: "Чат" },
    { k: "profile", label: "Профил" },
    { k: "plans", label: "Планове" },
  ];
  return (
    <div className="hidden md:block bg-white/70 backdrop-blur border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm",
              tab === t.k ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"
            )}
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 text-sm">
          <div className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Coins className="h-4 w-4" />
            Монети: <b className="ml-1">{coins}</b>
          </div>
          <div className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
            {plan ? `План: ${plan}` : "Без план"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========== App =========== */
export default function LoveLinkMVP() {
  const [tab, setTab] = useState<"discover" | "chat" | "profile" | "plans">(
    "discover"
  );
  const [me, setMe] = useState<User>(() => {
    const saved = localStorage.getItem("ll_me");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      id: "me",
      name: "Гост",
      age: 28,
      gender: "",
      zodiac: "",
      city: "София",
      interests: ["музика", "филми"],
      bio: "Демо профил (локален).",
      photos: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
      ],
      online: true,
    };
  });
  const [coins, setCoins] = useState<number>(
    () => Number(localStorage.getItem("ll_coins") || "25")
  );
  const [plan, setPlan] = useState<string>(
    () => localStorage.getItem("ll_plan") || ""
  );
  const [filters, setFilters] = useState<any>({
    gender: "",
    city: "",
    zodiac: "",
  });
  const [queue, setQueue] = useState<User[]>(() => DEMO_USERS);
  const [activePeer, setActivePeer] = useState<User | null>(null);

  // локално съхранение
  useEffect(() => {
    localStorage.setItem("ll_coins", String(coins));
  }, [coins]);
  useEffect(() => {
    if (plan) localStorage.setItem("ll_plan", plan);
  }, [plan]);
  useEffect(() => {
    localStorage.setItem("ll_me", JSON.stringify(me));
  }, [me]);

  // PWA SW (без файл → просто игнорира грешката)
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const swPath = (import.meta as any).env.BASE_URL
        ? (import.meta as any).env.BASE_URL + "ll-sw.js"
        : "/ll-sw.js";
      navigator.serviceWorker.register(swPath).catch(() => {});
    }
  }, []);

  // Зареди профили според филтри (от DEMO_USERS)
  useEffect(() => {
    const q = DEMO_USERS.filter(
      (u) =>
        (!filters.gender || u.gender === filters.gender) &&
        (!filters.city ||
          u.city.toLowerCase().includes(String(filters.city).toLowerCase())) &&
        (!filters.zodiac || u.zodiac === filters.zodiac)
    );
    setQueue(q);
  }, [filters]);

  // Действия
  function like(u: User) {
    setQueue((q) => q.slice(1));
    alert(`Хареса ${u.name} (демо).`);
  }
  function nope(_u: User) {
    setQueue((q) => q.slice(1));
  }
  function message(u: User) {
    setTab("chat");
    setActivePeer(u);
  }

  const current = queue[0];

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#fff6f7,#eef3ff)] text-neutral-900">
      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2">
          <Star className="h-5 w-5 text-rose-500" />
          <div className="text-sm">
            Здравей, <b>{me.name}</b>!
          </div>
          <div className="ml-auto text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
            {plan || "Без план"}
          </div>
        </div>
      </div>

      <TopTabs tab={tab} setTab={setTab} coins={coins} plan={plan} />

      {tab === "discover" && (
        <Discover
          queue={queue}
          like={like}
          nope={nope}
          message={message}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      {tab === "chat" &&
        (activePeer ? (
          <DirectChat me={me} peer={activePeer} />
        ) : (
          <GlobalChat me={me} roomId="global" />
        ))}
      {tab === "profile" && <Profile me={me} setMe={setMe} />}
      {tab === "plans" && (
        <Plans
          coins={coins}
          setCoins={setCoins as any}
          plan={plan}
          setPlan={setPlan}
        />
      )}

      <ActionDock
        visible={tab === "discover" && !!current}
        onDislike={() => current && nope(current)}
        onMessage={() => current && message(current)}
        onLike={() => current && like(current)}
      />

      <TabBar tab={tab} setTab={setTab} coins={coins} plan={plan} />

      <footer className="mt-16 py-8 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} LoveLink · Демо (без вход/бекенд)
      </footer>
    </div>
  );
}
