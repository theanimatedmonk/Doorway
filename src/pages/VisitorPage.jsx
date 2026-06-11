import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import TypingWelcome from '../components/TypingWelcome'
import VisitorScreen from '../components/VisitorScreen'

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
      <VisitorScreen className="px-4">
        <div className="loader" />
      </VisitorScreen>
    )
  }

  if (phase === 'not-found') {
    return (
      <VisitorScreen className="px-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900">Link not found</h1>
          <p className="mt-2 text-slate-500">This link may have been removed or doesn't exist.</p>
        </div>
      </VisitorScreen>
    )
  }

  return (
    <VisitorScreen className="px-6">
      <TypingWelcome recipientName={link.recipient_name} onComplete={handleComplete} />
    </VisitorScreen>
  )
}
