import { setCors, handleOptions } from './_lib/cors.js'
import { getShareBaseUrl, normalizeBaseUrl } from './_lib/url.js'

export default async function handler(req, res) {
  setCors(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let shareBaseUrl = null
  try {
    shareBaseUrl = getShareBaseUrl()
  } catch {
    shareBaseUrl = null
  }

  let customDomain = null
  if (process.env.APP_URL) {
    try {
      customDomain = normalizeBaseUrl(process.env.APP_URL)
    } catch {
      customDomain = null
    }
  }

  return res.status(200).json({
    share_base_url: shareBaseUrl,
    site_url: shareBaseUrl,
    custom_domain: customDomain,
    uses_vercel_domain: Boolean(process.env.VERCEL_URL && !process.env.APP_URL),
  })
}
