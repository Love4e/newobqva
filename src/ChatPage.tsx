import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ChatWindow from "../components/chat/ChatWindow";
import MessageInput from "../components/chat/MessageInput";

export default function ChatPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user.id ?? null));
    const sub = supabase.auth.onAuthStateChange((_e, s) => setUserId(s?.user?.id ?? null));
    return () => sub.data.subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
  };
  const signOut = async () => supabase.auth.signOut();

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      {/* header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 px-4 py-2 flex items-center justify-between">
        <div className="font-semibold text-slate-700">Общ чат</div>
        <div className="flex items-center gap-2">
          {userId ? (
            <button onClick={signOut} className="text-sm text-slate-600 hover:text-slate-900">
              Изход
            </button>
          ) : (
            <button onClick={signIn} className="text-sm text-pink-600 hover:text-pink-700">
              Вход
            </button>
          )}
        </div>
      </div>

      {/* chat list */}
      <ChatWindow roomId="global" currentUserId={userId} />

      {/* input */}
      <MessageInput roomId="global" userId={userId} />
    </div>
  );
}
