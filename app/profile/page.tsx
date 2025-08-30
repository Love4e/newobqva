// app/profile/page.tsx
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";
import { createSupabaseServer } from "@/lib/supabaseServer";

export const revalidate = 0;

function Currency({ value, currency = "BGN" }: { value: number; currency?: string }) {
  return (
    <>
      {new Intl.NumberFormat("bg-BG", { style: "currency", currency }).format(Number(value || 0))}
    </>
  );
}

export default async function ProfilePage() {
  const supabase = createSupabaseServer();

  // 1) Потребител от сесията (Google OAuth)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const fullName =
    (user.user_metadata?.name as string) ||
    `${user.user_metadata?.given_name ?? ""} ${user.user_metadata?.family_name ?? ""}`.trim() ||
    user.email;

  const avatar =
    (user.user_metadata?.picture as string) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff`;

  const phone = (user.user_metadata?.phone as string) ?? null;

  // 2) Данни от базата
  // СЪОБРАЗИ имената/полета според твоята схема.
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, amount, currency, pdf_url, created_at, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("id, plan_name, currency, price, current_period_end, active")
    .eq("user_id", user.id)
    .eq("active", true)
    .order("current_period_end", { ascending: false });

  const { data: ads } = await supabase
    .from("ads")
    .select("id, title, status, price, currency, created_at, expires_at")
    .eq("user_id", user.id)
    .in("status", ["active", "pending"])
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-indigo-600/20">
            <Image src={avatar} alt={fullName ?? "Avatar"} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{fullName}</h1>
            <p className="text-slate-600">{user.email}</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-slate-800">Профил</h3>
              <dl className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Име</dt>
                  <dd className="font-medium text-slate-900">{fullName}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Имейл</dt>
                  <dd className="font-medium text-slate-900">{user.email}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Провайдър</dt>
                  <dd className="font-medium text-slate-900">
                    {Array.isArray(user.app_metadata?.providers)
                      ? (user.app_metadata.providers as string[]).join(", ")
                      : user.app_metadata?.provider ?? "google"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Регистрация</dt>
                  <dd className="font-medium text-slate-900">
                    {new Date(user.created_at!).toLocaleString("bg-BG")}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Редакция на телефон */}
            <ProfileClient initialPhone={phone} />
          </div>

          {/* Right */}
          <div className="lg:col-span-2 space-y-8">
            {/* Абонаменти */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Активни абонаменти</h3>
                <Link href="/pricing" className="text-sm font-medium text-indigo-600 hover:underline">
                  Вземи нов план
                </Link>
              </div>
              {subscriptions && subscriptions.length ? (
                <ul className="divide-y divide-slate-100">
                  {subscriptions.map((s) => (
                    <li key={s.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-slate-900">{s.plan_name}</p>
                        <p className="text-sm text-slate-500">
                          До:{" "}
                          {s.current_period_end
                            ? new Date(s.current_period_end as any).toLocaleString("bg-BG")
                            : "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          <Currency value={Number(s.price ?? 0)} currency={s.currency || "BGN"} />
                        </p>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Активен
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">Нямаш активни абонаменти.</p>
              )}
            </div>

            {/* Фактури */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Фактури и плащания</h3>
              </div>
              {invoices && invoices.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500">
                        <th className="px-0 py-2 font-medium">#</th>
                        <th className="px-4 py-2 font-medium">Дата</th>
                        <th className="px-4 py-2 font-medium">Сума</th>
                        <th className="px-4 py-2 font-medium">Статус</th>
                        <th className="px-4 py-2 font-medium" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoices.map((inv, idx) => (
                        <tr key={inv.id}>
                          <td className="px-0 py-3 text-slate-900">{idx + 1}</td>
                          <td className="px-4 py-3 text-slate-700">
                            {new Date(inv.created_at as any).toLocaleString("bg-BG")}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            <Currency value={Number(inv.amount ?? 0)} currency={inv.currency || "BGN"} />
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                inv.status === "paid"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : inv.status === "refunded"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {inv.status ?? "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {inv.pdf_url ? (
                              <a
                                href={inv.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline"
                              >
                                PDF фактура
                              </a>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-600">Нямаш налични фактури.</p>
              )}
            </div>

            {/* Обяви */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Активни обяви</h3>
                <Link href="/post" className="text-sm font-medium text-indigo-600 hover:underline">
                  Нова обява
                </Link>
              </div>
              {ads && ads.length ? (
                <ul className="divide-y divide-slate-100">
                  {ads.map((ad) => (
                    <li key={ad.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-slate-900">{ad.title ?? `Обява ${ad.id}`}</p>
                        <p className="text-sm text-slate-500">
                          Статус: <span className="font-medium text-slate-700">{ad.status}</span> • Създадена:{" "}
                          {new Date(ad.created_at as any).toLocaleDateString("bg-BG")}
                          {ad.expires_at ? (
                            <>
                              {" "}
                              • До: {new Date(ad.expires_at as any).toLocaleDateString("bg-BG")}
                            </>
                          ) : null}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-slate-900">
                          <Currency value={Number(ad.price ?? 0)} currency={ad.currency || "BGN"} />
                        </p>
                        <Link
                          href={`/ads/${ad.id}`}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Управление
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">Нямаш активни обяви.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
