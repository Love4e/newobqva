// lib/supabase-browser.ts
"use client";

import { createClient } from "@supabase/supabase-js";

// Клиентът се ползва в client компоненти (Login, Callback, Profile и т.н.)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,       // пази сесията в localStorage
      autoRefreshToken: true,     // автоматично освежава токена
      detectSessionInUrl: true,   // за /auth/callback с ?code=
    },
  }
);
