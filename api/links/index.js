import { getSupabase } from '../_lib/supabase.js'
import { setCors, handleOptions } from '../_lib/cors.js'
import { resolveUniqueSlug } from '../_lib/slug.js'
import { normalizeUrl, getShareUrl, getShareBaseUrl } from '../_lib/url.js'

export default async function handler(req, res) {
  setCors(res)
  if (handleOptions(req, res)) return

  try {
    const supabase = getSupabase()

    if (req.method === 'GET') {
      const { data: links, error } = await supabase
        .from('links')
        .select('*, visits(count)')
        .order('created_at', { ascending: false })

      if (error) throw error

      const shareBaseUrl = getShareBaseUrl()

      const formatted = links.map((link) => ({
        id: link.id,
        purpose: link.purpose,
        recipient_name: link.recipient_name,
        slug: link.slug,
        base_url: shareBaseUrl || link.base_url,
        destination_url: link.destination_url,
        share_url: getShareUrl(shareBaseUrl || link.base_url, link.slug),
        created_at: link.created_at,
        view_count: link.visits?.[0]?.count ?? 0,
        status: (link.visits?.[0]?.count ?? 0) > 0 ? 'Viewed' : 'Not Viewed',
      }))

      return res.status(200).json(formatted)
    }

    if (req.method === 'POST') {
      const { purpose, recipient_name, destination_url, slug } = req.body

      if (!purpose?.trim() || !recipient_name?.trim() || !destination_url?.trim()) {
        return res.status(400).json({ error: 'Purpose, recipient name, and destination URL are required' })
      }

      let destinationUrl
      let baseUrl

      try {
        destinationUrl = normalizeUrl(destination_url, 'destination URL')
        baseUrl = getShareBaseUrl()
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }

      if (!baseUrl) {
        return res.status(500).json({
          error: 'No share URL configured. Deploy to Vercel or set APP_URL in environment variables.',
        })
      }

      let resolvedSlug

      try {
        resolvedSlug = await resolveUniqueSlug(supabase, {
          slug: slug?.trim(),
          fallback: recipient_name,
        })
      } catch {
        return res.status(400).json({ error: 'Invalid link slug' })
      }

      const { data, error } = await supabase
        .from('links')
        .insert({
          purpose: purpose.trim(),
          recipient_name: recipient_name.trim(),
          slug: resolvedSlug,
          base_url: baseUrl,
          destination_url: destinationUrl,
        })
        .select()
        .single()

      if (error) throw error

      return res.status(201).json({
        ...data,
        share_url: getShareUrl(baseUrl, data.slug),
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Links API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
