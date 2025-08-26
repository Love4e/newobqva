// src/types.ts
export type Profile = {
  id: string;               // = auth.users.id
  display_name: string | null;
  gender: 'мъж' | 'жена' | 'друго' | null;
  city: string | null;
  zodiac: string | null;
  bio: string | null;
  avatar_url: string | null;
  updated_at: string | null;
};
