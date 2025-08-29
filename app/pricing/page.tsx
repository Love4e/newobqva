"use client"
import { useState } from "react"

export default function PricingPage() {
  const [currency, setCurrency] = useState<"BGN" | "EUR">("BGN")

  const links = {
    sub: currency === "BGN"
      ? process.env.NEXT_PUBLIC_REVOLUT_LINK_SUB_BGN
      : process.env.NEXT_PUBLIC_REVOLUT_LINK_SUB_EUR,
    vip: currency === "BGN"
      ? process.env.NEXT_PUBLIC_REVOLUT_LINK_VIP_BGN
      : process.env.NEXT_PUBLIC_REVOLUT_LINK_VIP_EUR,
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Абонаменти</h1>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setCurrency("BGN")}
          className={currency === "BGN" ? "bg-blue-500 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
        >
          BGN
        </button>
        <button
          onClick={() => setCurrency("EUR")}
          className={currency === "EUR" ? "bg-blue-500 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
        >
          EUR
        </button>
      </div>

      <div className="grid gap-6">
        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Седмичен абонамент</h2>
          <p className="mb-4">Публикувай обяви за 7 дни.</p>
          <a href={links.sub || "#"} target="_blank" rel="noopener noreferrer">
            <button className="bg-green-600 text-white px-6 py-2 rounded">Плати</button>
          </a>
        </div>

        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">VIP Обява</h2>
          <p className="mb-4">24 часа на първа страница.</p>
          <a href={links.vip || "#"} target="_blank" rel="noopener noreferrer">
            <button className="bg-yellow-600 text-white px-6 py-2 rounded">Плати</button>
          </a>
        </div>
      </div>
    </div>
  )
}
