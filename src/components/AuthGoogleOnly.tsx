import { LogIn } from "lucide-react";
import { supabase } from "../supabase";

export default function AuthGoogleOnly() {
  const handleGoogle = async () => {
    // GitHub Pages base (без hash) – после HashRouter си продължава
    const redirect = `${window.location.origin}/lovelink-mvp/`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirect }
    });

    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-rose-500 text-xl">★</span>
          <h1 className="text-xl font-semibold">LoveLink</h1>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full h-12 rounded-xl bg-black text-white flex items-center justify-center gap-2 hover:bg-neutral-800 transition"
        >
          <LogIn className="w-5 h-5" />
          Вход с Google
        </button>

        <p className="mt-4 text-center text-xs text-neutral-500">
          Защитено от Supabase Auth
        </p>
      </div>
    </div>
  );
}
