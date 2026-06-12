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
