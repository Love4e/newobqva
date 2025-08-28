import React, { useEffect, useState } from "react";
import { LogOut, Chrome, UserRound } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

const BASE = (import.meta.env.BASE_URL || "/") as string;

export default function App() {
  const [me, setMe] = useState<any | null>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    const href = window.location.href;
    const qs = new URL(href).searchParams;
    const hash = window.location.hash?.slice(1) || "";
    const hs = new URLSearchParams(hash);
    if (!(qs.get("code") || hs.get("code")) || (window as any).__ll_pkce_done) return;
    (window as any).__ll_pkce_done = true;
    supabase.auth.exchangeCodeForSession(href).finally(() => {
      const clean = new URL(BASE, window.location.origin).toString();
      window.history.replaceState({}, document.title, clean);
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    async function setFromSession(session: Session | null) {
      if (!mounted) return;
      if (session?.user) {
        const u = session.user;
        try {
          const { data, error } = await supabase.from("profiles").select("*").eq("id", u.id).single();
          if (!error && data) setMe(data);
          else {
            const base = { id: u.id, name: u.email?.split("@")[0] || "Потребител", city: "", zodiac: "", age: 28, interests: [], bio: "", photos: [] };
            await supabase.from("profiles").upsert(base);
            setMe(base);
          }
        } catch {
          setMe({ id: u.id, name: u.email?.split("@")[0] || "Потребител" });
        }
      } else setMe(null);
    }
    supabase.auth.getSession().then(({ data }) => setFromSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setFromSession(s));
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  async function signInGoogle() {
    try {
      const redirectTo = new URL(BASE, window.location.origin).toString();
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo, queryParams: { prompt: "select_account" } } });
      if (error) throw error;
    } catch (e: any) { setErr(e.message || String(e)); }
  }

  async function signOut() {
    await supabase.auth.signOut();
    const clean = new URL(BASE, window.location.origin).toString();
    window.location.replace(clean);
  }

  return (<div style={{ fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 720, margin: "0 auto" }}>
    <h1>LoveLink</h1>
    {!me ? (<div><button onClick={signInGoogle} style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}><Chrome size={18}/> Вход с Google</button>{err && <div style={{ color: "#b00020" }}>{err}</div>}</div>) :
      (<div style={{ border: "1px solid #eee", padding: 12, borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><UserRound size={18}/><b>{me.name}</b>
        <button onClick={signOut} style={{ marginLeft: "auto", padding: 8, borderRadius: 10, border: "1px solid #ddd" }}><LogOut size={16}/> Изход</button></div>
      </div>)
    }</div>);
}