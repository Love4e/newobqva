// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, User } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // ако няма логнат потребител → връщаме го към login
        router.push("/");
      } else {
        setUser(user);
      }
    }
    loadUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Зареждане...</h1>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h1>Добре дошъл 👋</h1>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <button
        onClick={handleLogout}
        style={{
          background: "#6366f1",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        Изход
      </button>
    </div>
  );
}
