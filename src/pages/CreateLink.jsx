import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function CreateLink() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    purpose: '',
    recipient_name: '',
    destination_url: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [created, setCreated] = useState(null)

  const baseUrl = window.location.origin

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

  if (created) {
    const fullUrl = `${baseUrl}/${created.slug}`

    return (
      <div className="max-w-lg">
        <h1 className="text-2xl font-semibold tracking-tight">Link Created</h1>
        <p className="mt-1 text-slate-500">Share this link with {created.recipient_name}.</p>

        <div className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Generated link</p>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-slate-50 px-3 py-2 text-sm">/{created.slug}</code>
              <button
                onClick={() => copyToClipboard(`/${created.slug}`)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Full URL</p>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-slate-50 px-3 py-2 text-sm">{fullUrl}</code>
              <button
                onClick={() => copyToClipboard(fullUrl)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                Copy
              </button>
            </div>
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
      <p className="mt-1 text-slate-500">Generate a personalized portfolio link.</p>

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
        </div>

        <div>
          <label htmlFor="destination_url" className="block text-sm font-medium text-slate-700">
            Destination URL
          </label>
          <input
            id="destination_url"
            name="destination_url"
            type="text"
            required
            placeholder="https://sajalkumar.com"
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
