// src/ProfileCard.tsx
import React from "react";
import { X, MessageCircle, Heart } from "lucide-react";
import { motion } from "framer-motion";

export type Profile = {
  id?: string | number;
  name: string;
  age: number;
  photo: string;
  bio?: string;
  interests?: string[];
};

type Props = {
  profile: Profile;
  onDislike?: () => void;
  onMessage?: () => void;
  onLike?: () => void;
};

export default function ProfileCard({
  profile: p,
  onDislike,
  onMessage,
  onLike,
}: Props) {
  return (
    <section className="relative">
      {/* Картата */}
      <div className="rounded-3xl overflow-hidden shadow-2xl bg-neutral-900/5">
        <img
          src={p.photo}
          alt={p.name}
          className="h-[440px] w-full object-cover"
          loading="lazy"
        />

        {/* Текст върху снимката */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white
                        bg-gradient-to-t from-black/70 via-black/20 to-transparent">
          <h3 className="text-2xl font-extrabold drop-shadow">
            {p.name}, {p.age}
          </h3>

          {p.interests?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {p.interests.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-sm rounded-full bg-white/20 backdrop-blur ring-1 ring-white/15"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          {p.bio && <p className="mt-3 text-white/90">{p.bio}</p>}
        </div>
      </div>

      {/* ФИКСИРАН DOCK – винаги отгоре, не се реже и не се покрива */}
      <div
        className="
          fixed left-1/2 -translate-x-1/2
          bottom-[calc(0.75rem+env(safe-area-inset-bottom))]
          z-[2147483647] pointer-events-auto
        "
      >
        {/* Ореол за контраст */}
        <div className="pointer-events-none absolute -z-10 left-1/2 -translate-x-1/2 bottom-1">
          <div className="h-14 w-[320px] blur-2xl rounded-full bg-black/10 dark:bg-black/20" />
        </div>

        <div className="flex items-center gap-5 [--btn:3.5rem] sm:[--btn:4rem]">
          <ActionBtn
            label="Откажи"
            onClick={onDislike}
            className="bg-white text-gray-700 ring-1 ring-black/10"
          >
            <X className="h-6 w-6" />
          </ActionBtn>

          <ActionBtn
            label="Съобщение"
            onClick={onMessage}
            className="bg-amber-400 text-white ring-1 ring-black/10"
          >
            <MessageCircle className="h-6 w-6" />
          </ActionBtn>

          <ActionBtn
            label="Харесай"
            onClick={onLike}
            className="bg-rose-500 text-white ring-1 ring-black/10"
          >
            <Heart className="h-6 w-6" />
          </ActionBtn>
        </div>
      </div>
    </section>
  );
}

/* Унифициран бутон с анимации и достъпност */
function ActionBtn({
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
