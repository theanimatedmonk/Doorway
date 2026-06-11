import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { formatDate, formatDateTime, formatLocation, formatDevice } from '../lib/format'

export default function LinkDetails() {
  const { id } = useParams()
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const baseUrl = window.location.origin

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

  const fullUrl = `${baseUrl}/${link.slug}`

  return (
    <div>
      <Link to="/" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to Dashboard
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{link.purpose}</h1>
          <p className="mt-1 text-slate-500">For {link.recipient_name}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            link.status === 'Viewed'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {link.status}
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <DetailCard label="Recipient Name" value={link.recipient_name} />
        <DetailCard label="Destination URL" value={link.destination_url} isUrl />
        <DetailCard label="Share Link" value={fullUrl} />
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

function DetailCard({ label, value, isUrl }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      {isUrl ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block truncate text-sm text-blue-600 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 truncate text-sm text-slate-900">{value}</p>
      )}
    </div>
  )
}
