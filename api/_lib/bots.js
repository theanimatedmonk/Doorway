const BOT_UA_PATTERNS = [
  'bot',
  'crawl',
  'spider',
  'slurp',
  'mediapartners',
  'facebookexternalhit',
  'facebot',
  'linkedinbot',
  'twitterbot',
  'slackbot',
  'whatsapp',
  'discordbot',
  'telegrambot',
  'applebot',
  'googlebot',
  'bingbot',
  'embedly',
  'skypeuripreview',
  'redditbot',
  'pinterest',
  'flipboard',
  'tumblr',
  'bitlybot',
  'rogerbot',
  'outbrain',
  'vkshare',
  'headlesschrome',
  'phantomjs',
  'selenium',
  'puppeteer',
  'preview',
  'wget',
  'curl',
  'python-requests',
  'axios',
  'go-http-client',
  'java/',
  'libwww',
]

export const BOT_UA_REGEX = new RegExp(BOT_UA_PATTERNS.join('|'), 'i')

export function isPreviewBot(userAgent) {
  if (!userAgent?.trim()) return true
  return BOT_UA_REGEX.test(userAgent)
}

// Cities that are almost exclusively cloud/preview crawler traffic.
const DATACENTER_GEOS = [
  { city: 'boydton', country: 'united states' },
  { city: 'des moines', country: 'united states' },
  { city: 'west des moines', country: 'united states' },
  { city: 'forest city', country: 'united states' },
  { city: 'prineville', country: 'united states' },
  { city: 'altoona', country: 'united states' },
  { city: 'clonee', country: 'ireland' },
]

export function isDatacenterGeo(city, country) {
  if (!city || !country) return false
  const normalizedCity = city.toLowerCase().trim()
  const normalizedCountry = country.toLowerCase().trim()

  return DATACENTER_GEOS.some(
    (geo) => normalizedCity === geo.city && normalizedCountry.includes(geo.country),
  )
}
