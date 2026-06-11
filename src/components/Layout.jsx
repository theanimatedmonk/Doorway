import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const location = useLocation()
  const isVisitorPage = !['/', '/create'].includes(location.pathname) && !location.pathname.startsWith('/links/')

  if (isVisitorPage) {
    return children
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Personal Links
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/"
              className={`transition-colors ${location.pathname === '/' ? 'font-medium text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/create"
              className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white transition-colors hover:bg-slate-700"
            >
              Create Link
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
