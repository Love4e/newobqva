import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import MessageBubble from "./MessageBubble";

type DbMessage = {
  id: number;
  room_id: string;
  user_id: string | null;
  content: string;
  created_at: string;
};

type Props = {
  roomId?: string;              // default: "global"
  currentUserId?: string | null;
};

export default function ChatWindow({ roomId = "global", currentUserId }: Props) {
  const [msgs, setMsgs] = useState<DbMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const formatTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  useEffect(() => {
    let ignore = false;

    (async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true })
        .limit(200);
      if (!ignore) {
        if (error) console.error(error);
        setMsgs(data ?? []);
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "auto" });
      }
    })();

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMsgs((curr) => [...curr, payload.new as DbMessage]);
          setTimeout(
            () => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }),
            0
          );
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return (
    <div className="flex flex-col h-full">
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
      >
        {msgs.map((m) => (
          <MessageBubble
            key={m.id}
            mine={m.user_id === currentUserId}
            text={m.content}
            time={formatTime(m.created_at)}
          />
        ))}
      </div>
    </div>
  );
}
