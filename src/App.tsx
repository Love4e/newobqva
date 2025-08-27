import { NavLink, Routes, Route, Navigate } from 'react-router-dom'

function TopNav() {
  const linkBase =
    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium'
  const active = 'bg-black text-white'
  const idle = 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="text-xl font-bold">LoveLink</div>
        <nav className="flex gap-2">
          <NavLink to="/discover" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Открий</NavLink>
          <NavLink to="/chat" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Чат</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Профил</NavLink>
        </nav>
      </div>
    </header>
  )
}

function DiscoverView() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Открий</h1>
      <p className="text-gray-600">Тук ще се рендерира каруселът/картите.</p>
    </section>
  )
}

function ChatView() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Чат</h1>
      <p className="text-gray-600">Тук ще се рендерира чатът.</p>
    </section>
  )
}

function ProfileView() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Профил</h1>
      <p className="text-gray-600">Тук ще се рендерира профилът/формата.</p>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <Routes>
        <Route path="/" element={<Navigate to="/discover" replace />} />
        <Route path="/discover" element={<DiscoverView />} />
        <Route path="/chat" element={<ChatView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="*" element={<Navigate to="/discover" replace />} />
      </Routes>
    </div>
  )
}
