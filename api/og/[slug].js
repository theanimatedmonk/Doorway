import { getSupabase } from '../_lib/supabase.js'
import { getShareBaseUrl } from '../_lib/url.js'
import { buildOgHtml } from '../_lib/og-html.js'

function getCanonicalUrl(req, slug) {
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const protocol = req.headers['x-forwarded-proto'] || 'https'

  if (host) {
    return `${protocol}://${host}/${slug}`
  }

  const baseUrl = getShareBaseUrl()
  if (baseUrl) {
    return `${baseUrl}/${slug}`
  }

  return `/${slug}`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method not allowed')
  }

  const { slug } = req.query

  try {
    const supabase = getSupabase()

    const { data: link } = await supabase
      .from('links')
      .select('recipient_name')
      .eq('slug', slug)
      .maybeSingle()

    const recipientName = link?.recipient_name?.trim() || 'there'
    const canonicalUrl = getCanonicalUrl(req, slug)
    const html = buildOgHtml({ recipientName, canonicalUrl })

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).end(html)
  } catch (error) {
    console.error('OG preview error:', error)
    const html = buildOgHtml({
      recipientName: 'there',
      canonicalUrl: getCanonicalUrl(req, slug),
    })
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return res.status(200).end(html)
  }
}
