// src/ActionDock.tsx
import React from "react";
import { motion } from "framer-motion";
import { X, MessageCircle, Heart } from "lucide-react";

type Props = {
  onDislike?: () => void;
  onMessage?: () => void;
  onLike?: () => void;
  /** дали да се вижда докът (ако имаш екран без карта) */
  visible?: boolean;
};

export default function ActionDock({
  onDislike,
  onMessage,
  onLike,
  visible = true,
}: Props) {
  if (!visible) return null;

  return (
    <div
      className="
        fixed left-1/2 -translate-x-1/2
        bottom-[calc(0.75rem+env(safe-area-inset-bottom))]
        z-[2147483647] pointer-events-auto
      "
    >
      {/* мек ореол под бутоните за контраст */}
      <div className="pointer-events-none absolute -z-10 left-1/2 -translate-x-1/2 bottom-1">
        <div className="h-14 w-[320px] blur-2xl rounded-full bg-black/10 dark:bg-black/20" />
      </div>

      <div className="flex items-center gap-5 [--btn:3.5rem] sm:[--btn:4rem]">
        <Btn label="Откажи" className="bg-white text-gray-700 ring-1 ring-black/10" onClick={onDislike}>
          <X className="h-6 w-6" />
        </Btn>

        <Btn label="Съобщение" className="bg-amber-400 text-white ring-1 ring-black/10" onClick={onMessage}>
          <MessageCircle className="h-6 w-6" />
        </Btn>

        <Btn label="Харесай" className="bg-rose-500 text-white ring-1 ring-black/10" onClick={onLike}>
          <Heart className="h-6 w-6" />
        </Btn>
      </div>
    </div>
  );
}

function Btn({
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
