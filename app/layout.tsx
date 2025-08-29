import './globals.css'

export const metadata = {
  title: 'NovaObyava — модерни обяви',
  description: 'Публикувай модерни обяви, VIP позиция и плащане през Revolut.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <main className="container py-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

function Header(){
  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <div className="container flex items-center gap-3 py-3">
        <a href="/" className="font-black text-xl tracking-tight">NovaObyava</a>
        <nav className="hidden sm:flex gap-1 ml-4 text-sm">
          <a className="navlink" href="/browse">Обяви</a>
          <a className="navlink" href="/post">Публикувай</a>
          <a className="navlink" href="/pricing">Абонамент</a>
          <a className="navlink" href="/admin/subscriptions">Админ</a>
        </nav>
        <a className="ml-auto btn" href="/post">Пусни обява</a>
      </div>
    </header>
  )
}

function Footer(){
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="container py-8 text-sm text-slate-600 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} NovaObyava</div>
        <div className="flex gap-3">
          <a className="link" href="#">Условия</a>
          <a className="link" href="#">Поверителност</a>
          <a className="link" href="#">Контакт</a>
        </div>
      </div>
    </footer>
  )
}
