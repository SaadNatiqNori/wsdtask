import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'Alcove'
const DEFAULT_TITLE = 'Alcove | Real Estate Development in Erbil, Kurdistan'
const DEFAULT_DESCRIPTION =
  'Alcove is a real estate development company in Erbil, Kurdistan — creating sustainable mixed-use, residential and industrial projects that build lasting value.'

// Fixed public origin for canonical/JSON-LD URLs. Optional: until the real
// domain goes live, canonicals follow whatever origin the site is served from.
const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '')

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMeta(attr, key) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove()
}

/**
 * Per-route document metadata. Renders nothing; mutates <head> on route
 * change so JS-rendering crawlers (Googlebot) see page-specific titles,
 * descriptions and canonicals. Link-preview bots that skip JS fall back to
 * the static defaults in index.html.
 */
export default function Seo({ title, description = DEFAULT_DESCRIPTION, noindex = false }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
    const origin = SITE_URL || window.location.origin
    const url = origin + pathname

    document.title = fullTitle
    upsertMeta('name', 'description', description)
    if (noindex) upsertMeta('name', 'robots', 'noindex')
    else removeMeta('name', 'robots')

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)

    if (!document.getElementById('alcove-org-schema')) {
      const script = document.createElement('script')
      script.id = 'alcove-org-schema'
      script.type = 'application/ld+json'
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: origin + '/',
        logo: origin + '/logo.png',
        description: DEFAULT_DESCRIPTION,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Erbil',
          addressRegion: 'Kurdistan Region',
          addressCountry: 'IQ',
        },
      })
      document.head.appendChild(script)
    }
  }, [title, description, noindex, pathname])

  return null
}
