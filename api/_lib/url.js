export function normalizeUrl(url, label = 'URL') {
  let value = url.trim()
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    value = `https://${value}`
  }
  try {
    return new URL(value).href.replace(/\/$/, '')
  } catch {
    throw new Error(`Invalid ${label}`)
  }
}

export function normalizeBaseUrl(url) {
  let value = url.trim()
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    value = `https://${value}`
  }
  try {
    return new URL(value).origin
  } catch {
    throw new Error('Invalid base URL')
  }
}

export function getShareUrl(baseUrl, slug) {
  if (!baseUrl) return `/${slug}`
  const base = baseUrl.replace(/\/$/, '')
  return `${base}/${slug}`
}

export function getShareBaseUrl() {
  if (process.env.APP_URL) {
    return normalizeBaseUrl(process.env.APP_URL)
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (process.env.SITE_URL) {
    return normalizeBaseUrl(process.env.SITE_URL)
  }
  return null
}
