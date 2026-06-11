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
