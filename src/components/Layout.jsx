import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import CreateLinkModal from './CreateLinkModal'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)
  const [linksRefreshToken, setLinksRefreshToken] = useState(0)

  const isVisitorPage =
    !['/', '/create'].includes(location.pathname) && !location.pathname.startsWith('/links/')

  useEffect(() => {
    if (location.pathname === '/create') {
      setCreateOpen(true)
      navigate('/', { replace: true })
    }
  }, [location.pathname, navigate])

  if (isVisitorPage) {
    return <Outlet />
  }

  function openCreateModal() {
    setCreateOpen(true)
  }

  function handleLinkCreated() {
    setLinksRefreshToken((token) => token + 1)
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
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white transition-colors hover:bg-slate-700"
            >
              Create Link
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet context={{ openCreateModal, linksRefreshToken }} />
      </main>

      <CreateLinkModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleLinkCreated}
      />
    </div>
  )
}
