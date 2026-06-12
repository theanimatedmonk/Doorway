import { BOT_UA_REGEX } from './api/_lib/bots.js'

const RESERVED = new Set(['create', 'links', 'api'])

export const config = {
  matcher: ['/((?!api|assets|favicon\\.svg).*)'],
}

export default function middleware(request) {
  const { pathname } = new URL(request.url)

  if (pathname === '/') return

  const segments = pathname.split('/').filter(Boolean)
  const slug = segments[0]

  if (!slug || segments.length > 1 || slug.includes('.') || RESERVED.has(slug)) {
    return
  }

  const ua = request.headers.get('user-agent') || ''
  if (!BOT_UA_REGEX.test(ua)) return

  return Response.redirect(new URL(`/api/og/${slug}`, request.url), 307)
}
