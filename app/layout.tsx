// app/layout.tsx
import './globals.css'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NovaObyava — модерни обяви',
  description:
    'Публикувай модерни обяви за секунди. Седмичен абонамент + VIP позиция. Плащане в BGN/EUR.',
  metadataBase: new URL('https://newobqva.vercel.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <SiteHeader />
        <main className="container py-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <div className="container flex items-center gap-3 py-3">
        <Link
          href="/"
          className="font-black text-xl tracking-tight hover:opacity-90"
        >
          NovaObyava
        </Link>

        <nav className="hidden md:flex gap-1 ml-4 text-sm">
          <Link className="navlink" href="/browse">
            Обяви
          </Link>
          <Link className="navlink" href="/post">
            Публикувай
          </Link>
          <Link className="navlink" href="/pricing">
            Абонамент
          </Link>
          <Link className="navlink" href="/admin/subscriptions">
            Админ
          </Link>
          <Link className="navlink" href="/profile">
            Профил
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link className="btn" href="/post">
            Пусни обява
          </Link>
        </div>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="container py-8 text-sm text-slate-600 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} NovaObyava</div>
        <nav className="flex gap-6">
          <Link className="hover:text-slate-900" href="/terms">
            Условия
          </Link>
          <Link className="hover:text-slate-900" href="/privacy">
            Поверителност
          </Link>
          <Link className="hover:text-slate-900" href="/contact">
            Контакт
          </Link>
        </nav>
      </div>
    </footer>
  )
}
