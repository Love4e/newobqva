// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './NavBar'
import Discover from './Discover'
import ChatPage from './ChatPage'
import Profile from './Profile'
// ако имаш форма за профил:
// import ProfileForm from './ProfileForm'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/profile/edit" element={<ProfileForm />} /> */}
          <Route path="*" element={<Navigate to="/discover" replace />} />
        </Routes>
      </div>
    </div>
  )
}
