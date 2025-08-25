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
    // Външен wrapper – тук слагаме бутоните (извън overflow контейнера)
    <section
      className="relative [--btn:3.5rem] sm:[--btn:4rem]"
      style={{
        // място за бутоните + iOS safe-area
        paddingBottom:
          "max(calc(var(--btn) + 1.25rem), env(safe-area-inset-bottom))",
      }}
    >
      {/* Картата със снимката и текста */}
      <div className="rounded-3xl overflow-hidden shadow-2xl bg-neutral-900/5">
        <img
          src={p.photo}
          alt={p.name}
          className="h-[440px] w-full objec
