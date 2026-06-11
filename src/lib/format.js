export function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatLocation(city, country) {
  if (city && country) return `${city}, ${country}`
  return country || 'Unknown'
}

export function formatDevice(browser, os) {
  if (browser && os) return `${browser} on ${os}`
  return browser || os || 'Unknown'
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function suggestSlug({ purpose, recipientName }) {
  if (purpose?.trim() && recipientName?.trim()) {
    return slugify(`${purpose.trim()} for ${recipientName.trim()}`)
  }
  if (recipientName?.trim()) return slugify(recipientName.trim())
  if (purpose?.trim()) return slugify(purpose.trim())
  return ''
}

export function getShareUrl(baseUrl, slug) {
  if (!baseUrl) return `/${slug}`
  return `${baseUrl.replace(/\/$/, '')}/${slug}`
}
