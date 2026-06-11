import { getSupabase } from '../../_lib/supabase.js'
import { setCors, handleOptions } from '../../_lib/cors.js'

export default async function handler(req, res) {
  setCors(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug } = req.query

  try {
    const supabase = getSupabase()

    const { data: link, error } = await supabase
      .from('links')
      .select('id, recipient_name, destination_url, slug')
      .eq('slug', slug)
      .single()

    if (error || !link) {
      return res.status(404).json({ error: 'Link not found' })
    }

    return res.status(200).json(link)
  } catch (error) {
    console.error('Slug lookup API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
