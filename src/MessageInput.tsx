import { useState } from "react";
import { supabase } from "../../lib/supabase";

type Props = { roomId: string; userId?: string | null };

export default function MessageInput({ roomId, userId }: Props) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  const disabled = !userId || !value.trim() || sending;

  const send = async () => {
    const text = value.trim();
    if (!text || !userId) return;
    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        room_id: roomId,
        user_id: userId,
        content: text,
      });
      if (!error) setValue("");
      else console.error(error);
    } finally {
      setSending(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-2 sm:p-3">
      {!userId && (
        <div className="text-xs text-slate-500 mb-1">
          Влез в акаунт, за да пишеш. (Четенето е свободно)
        </div>
      )}
      <div className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          placeholder="Напиши съобщение…"
          rows={1}
          className="flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          onClick={send}
          disabled={disabled}
          className="rounded-xl bg-pink-500 text-white px-4 py-2 font-medium disabled:opacity-40"
        >
          Изпрати
        </button>
      </div>
    </div>
  );
}
