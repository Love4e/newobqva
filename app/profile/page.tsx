// app/profile/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

// малък helper за форматиране на суми
function Currency({
  value,
  currency = "BGN",
}: {
  value: number;
  currency?: string;
}) {
  try {
    return (
      <>
        {new Intl.NumberFormat("bg-BG", {
          style: "currency",
          currency,
        }).format(value)}
      </>
    );
  } catch {
    return <>{value} {currency}</>;
  }
}

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

/** Server Action за запис на телефон */
async function updatePhone(formData: FormData) {
  "use server";
  const phone = (formData.get("phone") || "").toString();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("profiles")
    .upsert({ id: user.id, phone }, { onConflict: "id" });

  redirect("/profile");
}

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();

  // Потребител
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Профил (телефон)
  const { data: profile } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", user.id)
    .single();

  // Фактури
  const { data: invoices = [] } = await supabase
    .from("invoices")
    .select("id, created_at, amount, currency, status, pdf_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Абонаменти
  const { data: subscriptions = [] } = await supabase
    .from("subscriptions")
    .select(
      "id, plan_name, price, currency, current_period_end, active"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Обяви
  const { data: ads = [] } = await supabase
    .from("ads")
    .select("id, title, status, price, currency")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-indigo-600/20">
            {/* avatar_url идва от Google */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.user_metadata?.avatar_url ?? "/favicon.ico"}
              alt={user.user_metadata?.full_name ?? "User"}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {user.user_metadata?.full_name ?? "Профил"}
            </h1>
            <p className="text-slate-600">{user.email}</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Лява колона */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-slate-800">
                Профил
              </h3>
              <dl className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Име</dt>
                  <dd className="font-medium text-slate-900">
                    {user.user_metadata?.full_name ?? "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Имейл</dt>
                  <dd className="font-medium text-slate-900">
                    {user.email}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Провайдър</dt>
                  <dd className="font-medium text-slate-900">Google</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="mb-3 text-sm font-semibold text-slate-800">
                Телефон
              </h4>

              <form action={updatePhone} className="flex flex-col gap-3 sm:flex-row">
                <input
                  name="phone"
                  defaultValue={profile?.phone ?? ""}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
                  placeholder="+359 88 123 4567"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Запази
                </button>
              </form>
            </div>
          </div>

          {/* Дясна колона */}
          <div className="space-y-8 lg:col-span-2">
            {/* Абонаменти */}
            <SectionCard title="Активни абонаменти">
              {subscriptions.length ? (
                <ul className="divide-y divide-slate-100">
                  {subscriptions.map((s: any) => (
                    <li key={s.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {s.plan_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          До:{" "}
                          {s.current_period_end
                            ? new Date(s.current_period_end).toLocaleString("bg-BG")
                            : "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          <Currency value={Number(s.price || 0)} currency={s.currency || "BGN"} />
                        </p>
                        {s.active ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Активен
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                            Неактивен
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">Нямаш активни абонаменти.</p>
              )}
            </SectionCard>

            {/* Фактури */}
            <SectionCard title="Фактури и плащания">
              {invoices.length ? (
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
                      {invoices.map((inv: any, idx: number) => (
                        <tr key={inv.id}>
                          <td className="px-0 py-3 text-slate-900">{idx + 1}</td>
                          <td className="px-4 py-3 text-slate-700">
                            {inv.created_at
                              ? new Date(inv.created_at).toLocaleString("bg-BG")
                              : "—"}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            <Currency
                              value={Number(inv.amount || 0)}
                              currency={inv.currency || "BGN"}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                inv.status === "paid"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {inv.pdf_url ? (
                              <a
                                href={inv.pdf_url}
                                target="_blank"
                                rel="noreferrer"
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
            </SectionCard>

            {/* Обяви */}
            <SectionCard title="Активни обяви">
              {ads.length ? (
                <ul className="divide-y divide-slate-100">
                  {ads.map((ad: any) => (
                    <li key={ad.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-slate-900">{ad.title}</p>
                        <p className="text-sm text-slate-500">
                          Статус:{" "}
                          <span className="font-medium text-slate-700">
                            {ad.status}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-slate-900">
                          <Currency value={Number(ad.price || 0)} currency={ad.currency || "BGN"} />
                        </p>
                        {/* Тук по-късно можеш да вържеш към страница за редакция на обява */}
                        <a
                          href="#"
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Управление
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">Нямаш активни обяви.</p>
              )}
            </SectionCard>
          </div>
        </div>
      </section>
    </div>
  );
}
