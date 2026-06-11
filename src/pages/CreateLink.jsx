import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { getShareUrl } from '../lib/format'

export default function CreateLink() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    purpose: '',
    recipient_name: '',
    destination_url: '',
  })
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [created, setCreated] = useState(null)

  useEffect(() => {
    api.getConfig().then(setConfig).catch(() => {})
  }, [])

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const link = await api.createLink(form)
      setCreated(link)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
  }

  const previewSlug = form.recipient_name
    ? form.recipient_name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')
    : 'recipient'

  if (created) {
    const shareUrl = created.share_url || getShareUrl(created.base_url, created.slug)

    return (
      <div className="max-w-lg">
        <h1 className="text-2xl font-semibold tracking-tight">Link Created</h1>
        <p className="mt-1 text-slate-500">
          Send this link to {created.recipient_name}. They'll see a welcome screen, then get
          redirected to your destination.
        </p>

        <div className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Link to share</p>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-slate-50 px-3 py-2 text-sm">{shareUrl}</code>
              <button
                onClick={() => copyToClipboard(shareUrl)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
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
            onClick={() => navigate(`/links/${created.id}`)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            View Details
          </button>
          <button
            onClick={() => {
              setCreated(null)
              setForm({ purpose: '', recipient_name: '', destination_url: '' })
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Create Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold tracking-tight">Create Link</h1>
      <p className="mt-1 text-slate-500">
        Wrap any link — Loom, Google Slides, portfolio — and track when it's opened.
      </p>

      {config?.share_base_url ? (
        <p className="mt-2 text-xs text-slate-500">
          Share links: <span className="font-medium text-slate-700">{config.share_base_url}/recipient</span>
        </p>
      ) : (
        <p className="mt-2 text-xs text-amber-600">
          Set APP_URL in .env for local dev, or deploy to Vercel for automatic share links.
        </p>
      )}

      {config?.uses_vercel_domain && (
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Using your Vercel URL for now. To use your own domain (e.g. links.sajalkumar.com), connect a
          subdomain in Vercel and set APP_URL — your main site on Framer can stay as-is.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
          <input
            id="recipient_name"
            name="recipient_name"
            type="text"
            required
            placeholder="Quyen"
            value={form.recipient_name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          {config?.share_base_url && form.recipient_name && (
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

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Link'}
        </button>
      </form>
    </div>
  )
}
