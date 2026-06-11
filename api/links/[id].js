import { getSupabase } from '../_lib/supabase.js'
import { setCors, handleOptions } from '../_lib/cors.js'
import { getShareUrl, getShareBaseUrl } from '../_lib/url.js'

export default async function handler(req, res) {
  setCors(res)
  if (handleOptions(req, res)) return

  const { id } = req.query

  try {
    const supabase = getSupabase()

    if (req.method === 'DELETE') {
      const { data, error } = await supabase.from('links').delete().eq('id', id).select('id').single()

      if (error || !data) {
        return res.status(404).json({ error: 'Link not found' })
      }

      return res.status(200).json({ success: true })
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('id', id)
      .single()

    if (linkError || !link) {
      return res.status(404).json({ error: 'Link not found' })
    }

    const { data: visits, error: visitsError } = await supabase
      .from('visits')
      .select('*')
      .eq('link_id', id)
      .order('visited_at', { ascending: false })

    if (visitsError) throw visitsError

    const totalViews = visits.length
    const firstViewed = visits.length > 0 ? visits[visits.length - 1].visited_at : null
    const lastViewed = visits.length > 0 ? visits[0].visited_at : null

    const shareBaseUrl = getShareBaseUrl() || link.base_url

    return res.status(200).json({
      ...link,
      base_url: shareBaseUrl,
      share_url: getShareUrl(shareBaseUrl, link.slug),
      total_views: totalViews,
      first_viewed: firstViewed,
      last_viewed: lastViewed,
      status: totalViews > 0 ? 'Viewed' : 'Not Viewed',
      visits,
    })
  } catch (error) {
    console.error('Link details API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
