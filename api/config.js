import { setCors, handleOptions } from './_lib/cors.js'
import { normalizeBaseUrl } from './_lib/url.js'

export default async function handler(req, res) {
  setCors(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const siteUrl = process.env.SITE_URL

  if (!siteUrl) {
    return res.status(200).json({ site_url: null })
  }

  try {
    return res.status(200).json({ site_url: normalizeBaseUrl(siteUrl) })
  } catch {
    return res.status(200).json({ site_url: null })
  }
}
