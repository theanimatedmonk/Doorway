import { getSupabase } from './_lib/supabase.js'
import { setCors, handleOptions } from './_lib/cors.js'
import { sendTelegramNotification } from './_lib/telegram.js'
import { isPreviewBot } from './_lib/bots.js'
import {
  getClientIp,
  getGeoFromIp,
  parseUserAgent,
  formatLocation,
  formatVisitTime,
} from './_lib/visitor.js'

export default async function handler(req, res) {
  setCors(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug } = req.body

  if (!slug) {
    return res.status(400).json({ error: 'Slug is required' })
  }

  if (isPreviewBot(req.headers['user-agent'])) {
    return res.status(200).json({ success: true, skipped: true })
  }

  try {
    const supabase = getSupabase()

    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('slug', slug)
      .single()

    if (linkError || !link) {
      return res.status(404).json({ error: 'Link not found' })
    }

    const ip = getClientIp(req)
    const geo = await getGeoFromIp(ip)
    const ua = parseUserAgent(req.headers['user-agent'])
    const referrer = req.headers['referer'] || req.headers['referrer'] || null
    const visitedAt = new Date()

    const { data: visit, error: visitError } = await supabase
      .from('visits')
      .insert({
        link_id: link.id,
        ip_address: ip,
        country: geo.country,
        city: geo.city,
        browser: ua.browser,
        os: ua.os,
        device_type: ua.device_type,
        referrer,
        visited_at: visitedAt.toISOString(),
      })
      .select()
      .single()

    if (visitError) throw visitError

    await sendTelegramNotification({
      recipientName: link.recipient_name,
      purpose: link.purpose,
      time: formatVisitTime(visitedAt),
      location: formatLocation(geo.city, geo.country),
      device: ua.deviceLabel,
    })

    return res.status(201).json({ success: true, visit })
  } catch (error) {
    console.error('Visit API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
