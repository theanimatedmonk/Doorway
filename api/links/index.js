import { getSupabase } from '../_lib/supabase.js'
import { setCors, handleOptions } from '../_lib/cors.js'
import { generateUniqueSlug } from '../_lib/slug.js'
import { normalizeUrl, normalizeBaseUrl, getShareUrl } from '../_lib/url.js'

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

      const formatted = links.map((link) => ({
        id: link.id,
        purpose: link.purpose,
        recipient_name: link.recipient_name,
        slug: link.slug,
        base_url: link.base_url,
        destination_url: link.destination_url,
        share_url: link.base_url ? getShareUrl(link.base_url, link.slug) : null,
        created_at: link.created_at,
        view_count: link.visits?.[0]?.count ?? 0,
        status: (link.visits?.[0]?.count ?? 0) > 0 ? 'Viewed' : 'Not Viewed',
      }))

      return res.status(200).json(formatted)
    }

    if (req.method === 'POST') {
      const { purpose, recipient_name, destination_url } = req.body

      if (!purpose?.trim() || !recipient_name?.trim() || !destination_url?.trim()) {
        return res.status(400).json({ error: 'Purpose, recipient name, and destination URL are required' })
      }

      if (!process.env.SITE_URL) {
        return res.status(500).json({ error: 'SITE_URL is not configured in environment variables' })
      }

      let destinationUrl
      let baseUrl

      try {
        destinationUrl = normalizeUrl(destination_url, 'destination URL')
        baseUrl = normalizeBaseUrl(process.env.SITE_URL)
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }

      const slug = await generateUniqueSlug(supabase, recipient_name)

      const { data, error } = await supabase
        .from('links')
        .insert({
          purpose: purpose.trim(),
          recipient_name: recipient_name.trim(),
          slug,
          base_url: baseUrl,
          destination_url: destinationUrl,
        })
        .select()
        .single()

      if (error) throw error

      return res.status(201).json({
        ...data,
        share_url: getShareUrl(data.base_url, data.slug),
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Links API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
