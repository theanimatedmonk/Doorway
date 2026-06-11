import http from 'http'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const PORT = 3001

loadEnv()

function loadEnv() {
  const envPath = resolve(root, '.env')
  if (!existsSync(envPath)) return

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

const routes = [
  {
    methods: ['GET', 'OPTIONS'],
    match: (pathname) => (pathname === '/api/config' ? {} : null),
    load: () => import('../api/config.js'),
  },
  {
    methods: ['GET', 'POST', 'OPTIONS'],
    match: (pathname) => (pathname === '/api/links' ? {} : null),
    load: () => import('../api/links/index.js'),
  },
  {
    methods: ['GET', 'OPTIONS'],
    match: (pathname) => {
      const m = pathname.match(/^\/api\/links\/slug\/([^/]+)$/)
      return m ? { slug: m[1] } : null
    },
    load: () => import('../api/links/slug/[slug].js'),
  },
  {
    methods: ['GET', 'DELETE', 'OPTIONS'],
    match: (pathname) => {
      const m = pathname.match(/^\/api\/links\/([^/]+)$/)
      return m && m[1] !== 'slug' ? { id: m[1] } : null
    },
    load: () => import('../api/links/[id].js'),
  },
  {
    methods: ['POST', 'OPTIONS'],
    match: (pathname) => (pathname === '/api/visit' ? {} : null),
    load: () => import('../api/visit.js'),
  },
]

function createMockRes(res) {
  let statusCode = 200
  const headers = {}

  return {
    status(code) {
      statusCode = code
      return this
    },
    setHeader(key, value) {
      headers[key] = value
    },
    json(data) {
      headers['Content-Type'] = 'application/json'
      res.writeHead(statusCode, headers)
      res.end(JSON.stringify(data))
    },
    end(data) {
      res.writeHead(statusCode, headers)
      res.end(data)
    },
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString()
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve({})
      }
    })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const pathname = url.pathname

  const route = routes.find((r) => r.methods.includes(req.method) && r.match(pathname))

  if (!route) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }

  const params = route.match(pathname)
  const mod = await route.load()
  const handler = mod.default

  const mockReq = {
    method: req.method,
    headers: req.headers,
    body: req.method === 'POST' ? await readBody(req) : {},
    query: params || {},
    socket: { remoteAddress: req.socket.remoteAddress },
  }

  try {
    await handler(mockReq, createMockRes(res))
  } catch (error) {
    console.error('API error:', error)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Internal server error' }))
  }
})

server.listen(PORT, () => {
  console.log(`Local API running at http://localhost:${PORT}`)
})
