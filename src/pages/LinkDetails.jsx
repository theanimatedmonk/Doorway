import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { formatDate, formatDateTime, formatLocation, formatDevice, getShareUrl } from '../lib/format'

export default function LinkDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getLink(id)
      .then(setLink)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <p className="text-slate-500">Loading link details...</p>
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {error}
      </div>
    )
  }

  const shareUrl = link.share_url || getShareUrl(link.base_url, link.slug)

  async function handleDelete() {
    if (!confirm(`Delete link for ${link.recipient_name}? This cannot be undone.`)) return

    setDeleting(true)
    setError(null)

    try {
      await api.deleteLink(id)
      navigate('/')
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  return (
    <div>
      <Link to="/" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to Dashboard
      </Link>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{link.purpose}</h1>
          <p className="mt-1 text-slate-500">For {link.recipient_name}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              link.status === 'Viewed'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {link.status}
          </span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <DetailCard label="Recipient Name" value={link.recipient_name} />
        <DetailCard label="Link Slug" value={`/${link.slug}`} hint="URL path for this link." />
        <DetailCard
          label="Link to Share"
          value={shareUrl}
          isUrl
          hint="Send this to your recipient. They'll see a welcome screen, then get redirected."
        />
        <DetailCard
          label="Destination URL"
          value={link.destination_url}
          isUrl
          hint="Portfolio, Loom, Google Slides — wherever they end up."
        />
        <DetailCard label="Created Date" value={formatDate(link.created_at)} />
        <DetailCard label="First Viewed" value={formatDateTime(link.first_viewed)} />
        <DetailCard label="Last Viewed" value={formatDateTime(link.last_viewed)} />
        <DetailCard label="Total Views" value={String(link.total_views)} />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Recent Visits</h2>

        {link.visits.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No visits yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {link.visits.map((visit) => (
                  <tr key={visit.id}>
                    <td className="px-4 py-3 text-slate-600">{formatDateTime(visit.visited_at)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatLocation(visit.city, visit.country)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDevice(visit.browser, visit.os)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailCard({ label, value, isUrl, hint }) {
  function copy() {
    navigator.clipboard.writeText(value)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      {isUrl ? (
        <div className="mt-1 flex items-center gap-2">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate text-sm text-blue-600 hover:underline"
          >
            {value}
          </a>
          <button
            onClick={copy}
            className="shrink-0 rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
          >
            Copy
          </button>
        </div>
      ) : (
        <p className="mt-1 truncate text-sm text-slate-900">{value}</p>
      )}
      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
