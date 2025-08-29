"use client"
import { useState, useEffect } from "react"

export default function AdminSubscriptions() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/admin/subscriptions")
      .then(res => res.json())
      .then(setUsers)
  }, [])

  async function handleAction(userId: string, action: string) {
    await fetch("/api/admin/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action })
    })
    const res = await fetch("/api/admin/subscriptions")
    setUsers(await res.json())
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Управление на абонаменти</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Имейл</th>
            <th className="p-2">Активен до</th>
            <th className="p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.subscription_until ? new Date(u.subscription_until).toLocaleString() : "Няма"}</td>
              <td className="p-2 flex gap-2">
                <button onClick={() => handleAction(u.id, "activate")} className="bg-green-500 text-white px-3 py-1 rounded">+7д</button>
                <button onClick={() => handleAction(u.id, "clear")} className="bg-red-500 text-white px-3 py-1 rounded">Изчисти</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
