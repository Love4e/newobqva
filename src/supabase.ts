// src/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://gazaegcwedqiyaefkgsr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhemFlZ2N3ZWRxaXlhZWZrZ3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDU3NzYsImV4cCI6MjA3MTcyMTc3Nn0.DCz7PhdKzQiOGgQwjgZ3JdOS4LfB-Bmb32VatfRsHB8',
  { auth: { persistSession: true, autoRefreshToken: true } }
);
