import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { getShareUrl, suggestSlug } from '../lib/format'

function CloseIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export default function CreateLinkModal({ open, onClose, onCreated }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    purpose: '',
    recipient_name: '',
    slug: '',
    destination_url: '',
  })
  const [slugTouched, setSlugTouched] = useState(false)
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [created, setCreated] = useState(null)

  useEffect(() => {
    api.getConfig().then(setConfig).catch(() => {})
  }, [])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setCreated(null)
      setSlugTouched(false)
      setError(null)
      setForm({ purpose: '', recipient_name: '', slug: '', destination_url: '' })
    }
  }, [open])

  function handleChange(event) {
    const { name, value } = event.target

    if (name === 'slug') {
      setSlugTouched(true)
      setForm((prev) => ({ ...prev, slug: value }))
      return
    }

    setForm((prev) => {
      const next = { ...prev, [name]: value }

      if (!slugTouched && (name === 'purpose' || name === 'recipient_name')) {
        next.slug = suggestSlug({
          purpose: name === 'purpose' ? value : prev.purpose,
          recipientName: name === 'recipient_name' ? value : prev.recipient_name,
        })
      }

      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const link = await api.createLink(form)
      setCreated(link)
      onCreated?.(link)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
  }

  function resetForm() {
    setCreated(null)
    setSlugTouched(false)
    setForm({ purpose: '', recipient_name: '', slug: '', destination_url: '' })
  }

  if (!open) return null

  const previewSlug = form.slug || 'your-slug'

  if (created) {
    const shareUrl = created.share_url || getShareUrl(created.base_url, created.slug)

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
          type="button"
          aria-label="Close"
          className="absolute inset-0 bg-slate-900/50"
          onClick={onClose}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-link-success-title"
          className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          <h2 id="create-link-success-title" className="pr-8 text-xl font-semibold tracking-tight">
            Link Created
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Send this link to {created.recipient_name}. They'll see a welcome screen, then get
            redirected to your destination.
          </p>

          <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Link to share</p>
              <div className="mt-1 flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-white px-3 py-2 text-sm">{shareUrl}</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(shareUrl)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Destination</p>
              <p className="mt-1 truncate text-sm text-slate-600">{created.destination_url}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate(`/links/${created.id}`)
              }}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              View Details
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-link-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <h2 id="create-link-title" className="pr-8 text-xl font-semibold tracking-tight">
          Create Link
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Wrap any link — Loom, Google Slides, portfolio — and track when it's opened.
        </p>

        {config?.share_base_url ? (
          <p className="mt-2 text-xs text-slate-500">
            Share links:{' '}
            <span className="font-medium text-slate-700">{config.share_base_url}/your-slug</span>
          </p>
        ) : (
          <p className="mt-2 text-xs text-amber-600">
            Set APP_URL in .env for local dev, or deploy to Vercel for automatic share links.
          </p>
        )}

        {config?.uses_vercel_domain && (
          <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Using your Vercel URL for now. To use your own domain (e.g. hey.sajalkumar.com), connect a
            subdomain in Vercel and set APP_URL — your main site on Framer can stay as-is.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-slate-700">
              Purpose
            </label>
            <input
              id="purpose"
              name="purpose"
              type="text"
              required
              placeholder="Canva Outreach"
              value={form.purpose}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div>
            <label htmlFor="recipient_name" className="block text-sm font-medium text-slate-700">
              Recipient Name
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              Used in the welcome message — e.g. &quot;Hello Blessen 👋&quot;
            </p>
            <input
              id="recipient_name"
              name="recipient_name"
              type="text"
              required
              placeholder="Blessen"
              value={form.recipient_name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
              Link Slug
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              Shapes your share URL — e.g. email-designer-for-blessen
            </p>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              placeholder="email-designer-for-blessen"
              value={form.slug}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
            {config?.share_base_url && form.slug && (
              <p className="mt-1 text-xs text-slate-400">
                Share link preview: {config.share_base_url}/{previewSlug}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="destination_url" className="block text-sm font-medium text-slate-700">
              Destination URL
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              Where they land after the welcome screen — portfolio, Loom, Google Slides, anything.
            </p>
            <input
              id="destination_url"
              name="destination_url"
              type="text"
              required
              placeholder="https://loom.com/share/abc123"
              value={form.destination_url}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
