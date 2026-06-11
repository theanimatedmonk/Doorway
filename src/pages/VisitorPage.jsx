import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import TypingWelcome from '../components/TypingWelcome'

export default function VisitorPage() {
  const { slug } = useParams()
  const [phase, setPhase] = useState('loading')
  const [link, setLink] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const linkData = await api.getLinkBySlug(slug)
        if (cancelled) return

        setLink(linkData)
        setPhase('welcome')
        api.recordVisit(slug).catch(console.error)
      } catch {
        if (!cancelled) setPhase('not-found')
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [slug])

  const handleComplete = useCallback(() => {
    if (link?.destination_url) {
      window.location.replace(link.destination_url)
    }
  }, [link])

  if (phase === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="loader" />
      </div>
    )
  }

  if (phase === 'not-found') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900">Link not found</h1>
          <p className="mt-2 text-slate-500">This link may have been removed or doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <TypingWelcome recipientName={link.recipient_name} onComplete={handleComplete} />
    </div>
  )
}
