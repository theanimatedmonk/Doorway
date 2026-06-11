import { UAParser } from 'ua-parser-js'

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || null
}

export async function getGeoFromIp(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.')) {
    return { country: 'Local', city: 'Development' }
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`)
    const data = await response.json()

    if (data.status === 'success') {
      return { country: data.country || 'Unknown', city: data.city || 'Unknown' }
    }
  } catch (error) {
    console.error('Geo lookup failed:', error)
  }

  return { country: 'Unknown', city: 'Unknown' }
}

export function parseUserAgent(userAgent) {
  const parser = new UAParser(userAgent || '')
  const browser = parser.getBrowser()
  const os = parser.getOS()
  const device = parser.getDevice()

  const browserName = browser.name || 'Unknown Browser'
  const osName = os.name || 'Unknown OS'
  const deviceType = device.type || 'desktop'

  return {
    browser: browserName,
    os: osName,
    device_type: deviceType,
    deviceLabel: `${browserName} on ${osName}`,
  }
}

export function formatLocation(city, country) {
  if (city && country) return `${city}, ${country}`
  return country || 'Unknown'
}

export function formatVisitTime(date = new Date()) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
