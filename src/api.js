import { useState, useEffect } from 'react'

// Base URL of the Laravel CMS API. Falls back to localhost for dev.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function getJSON(path) {
  // `no-store` so the browser never serves a stale copy of this dynamic CMS
  // content (e.g. after a project is added or its "featured" flag changes).
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`)
  return res.json()
}

export async function postContact(body) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

// JsonResource endpoints wrap payloads in { data }. Unwrap transparently.
const unwrap = (res) => (res && res.data !== undefined ? res.data : res)

// Dedupe concurrent GETs for the same path: components that mount together
// (e.g. the four home sections all reading /content/home) share one request
// instead of each firing their own. The entry is dropped once the request
// settles, so a later mount (navigation) still fetches fresh CMS content.
const inflight = new Map()

function getJSONShared(path) {
  if (inflight.has(path)) return inflight.get(path)
  const promise = getJSON(path).finally(() => {
    inflight.delete(path)
  })
  inflight.set(path, promise)
  return promise
}

/**
 * Fetch `path` once on mount and merge the result over `fallback`.
 *
 * The component renders `fallback` (the original hardcoded content) immediately,
 * so animations run on stable data and the page still works if the API is down.
 * When the API responds, its (identical, seeded) content replaces the fallback.
 */
function useApiData(path, fallback, transform = (x) => x) {
  const [data, setData] = useState(fallback)

  useEffect(() => {
    let active = true
    getJSONShared(path)
      .then((res) => {
        const value = transform(unwrap(res))
        if (active && value != null) setData(value)
      })
      .catch(() => {
        // Keep the fallback on any network/parse error.
      })
    return () => {
      active = false
    }
  }, [path])

  return data
}

export const useProjects = (fallback = []) => useApiData('/projects', fallback)

export const useProject = (slug, fallback = null) =>
  useApiData(`/projects/${slug}`, fallback)

export const useContent = (page, fallback = {}) =>
  useApiData(`/content/${page}`, fallback)

export const useSettings = (fallback = {}) => useApiData('/settings', fallback)
