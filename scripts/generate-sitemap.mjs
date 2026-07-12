// Runs after `vite build` (see the build script in package.json).
// Emits dist/sitemap.xml, appends the Sitemap directive to dist/robots.txt,
// and rewrites the root-relative og:image URLs in dist/index.html to absolute.
// No-ops until VITE_SITE_URL is set — a sitemap pointing at the wrong host
// does more harm than having none.
import { readFile, writeFile, appendFile } from 'node:fs/promises'

const SITE_URL = (process.env.VITE_SITE_URL || '').replace(/\/+$/, '')
const API_URL = (process.env.VITE_API_URL || '').replace(/\/+$/, '')
const DIST = new URL('../dist/', import.meta.url)

// Live CMS slugs as of 2026-07-13 — used only when the API is unreachable at build time.
const FALLBACK_SLUGS = [
  'erbil-avenue',
  'avenue-square',
  'nice-village',
  'second-avenue',
  'new-north-industrial',
]

if (!SITE_URL) {
  console.log(
    '[sitemap] VITE_SITE_URL is not set — skipped sitemap.xml. Set it (e.g. https://alcove.example) once the domain is live.'
  )
  process.exit(0)
}

let slugs = FALLBACK_SLUGS
if (API_URL) {
  try {
    const res = await fetch(`${API_URL}/api/projects`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    })
    if (res.ok) {
      const json = await res.json()
      const list = Array.isArray(json) ? json : json.data
      const fetched = (list ?? []).map((p) => p.slug).filter(Boolean)
      if (fetched.length) slugs = fetched
    }
  } catch {
    console.warn('[sitemap] Could not fetch project slugs from the API — using the built-in list.')
  }
}

const routes = [
  '/',
  '/projects',
  ...slugs.map((slug) => `/projects/${slug}`),
  '/subsidiaries',
  '/about',
  '/contact',
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`).join('\n')}
</urlset>
`

await writeFile(new URL('sitemap.xml', DIST), xml)
await appendFile(new URL('robots.txt', DIST), `Sitemap: ${SITE_URL}/sitemap.xml\n`)

const indexPath = new URL('index.html', DIST)
const html = await readFile(indexPath, 'utf8')
await writeFile(indexPath, html.replaceAll('content="/og.png"', `content="${SITE_URL}/og.png"`))

console.log(`[sitemap] Wrote sitemap.xml (${routes.length} URLs) for ${SITE_URL}`)
