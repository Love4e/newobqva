import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

if (typeof url === 'string' && url && typeof anon === 'string' && anon) {
  client = createClient(url, anon)
} else {
  // Не хвърляме грешка, за да не пада приложението
  console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

export const supabase = client
