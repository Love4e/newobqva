// app/auth/callback/page.tsx
import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main style={{ maxWidth: 680, margin: "80px auto", textAlign: "center" }}>
          <h1>Зареждане…</h1>
        </main>
      }
    >
      <CallbackClient />
    </Suspense>
  );
}
