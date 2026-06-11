async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed')
  }

  return data
}

export const api = {
  getConfig: () => request('/api/config'),
  getLinks: () => request('/api/links'),
  createLink: (body) => request('/api/links', { method: 'POST', body: JSON.stringify(body) }),
  getLink: (id) => request(`/api/links/${id}`),
  deleteLink: (id) => request(`/api/links/${id}`, { method: 'DELETE' }),
  getLinkBySlug: (slug) => request(`/api/links/slug/${slug}`),
  recordVisit: (slug) => request('/api/visit', { method: 'POST', body: JSON.stringify({ slug }) }),
}
