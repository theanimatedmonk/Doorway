import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'

const FADE_DURATION = 300
const DISPLAY_DURATION = 1500
const TOTAL_DURATION = FADE_DURATION + DISPLAY_DURATION + FADE_DURATION

export default function VisitorPage() {
  const { slug } = useParams()
  const [phase, setPhase] = useState('loading')
  const [link, setLink] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const linkData = await api.getLinkBySlug(slug)
        if (cancelled) return

        setLink(linkData)
        setPhase('welcome')

        api.recordVisit(slug).catch(console.error)

        requestAnimationFrame(() => {
          requestAnimationFrame(() => setVisible(true))
        })

        setTimeout(() => setVisible(false), FADE_DURATION + DISPLAY_DURATION)

        setTimeout(() => {
          if (!cancelled) {
            window.location.href = linkData.destination_url
          }
        }, TOTAL_DURATION)
      } catch {
        if (!cancelled) setPhase('not-found')
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (phase === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
      </div>
    )
  }

  if (phase === 'not-found') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900">Link not found</h1>
          <p className="mt-2 text-slate-500">This link may have been removed or doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div
        className="text-center transition-opacity"
        style={{
          opacity: visible ? 1 : 0,
          transitionDuration: `${FADE_DURATION}ms`,
        }}
      >
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Hello {link.recipient_name} 👋
        </h1>
        <p className="mt-3 text-lg text-slate-500">Thanks for taking a look.</p>
      </div>
    </div>
  )
}
