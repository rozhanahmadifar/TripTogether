// Platforms with a public, CORS-friendly oEmbed endpoint can be fetched
// directly from the browser — no server involved. Instagram deliberately
// isn't here: Meta locked its oEmbed endpoint behind app-level
// authentication in 2020, so there's no way to fetch a preview for it
// without registering a Meta developer app, which is out of scope here —
// Instagram links simply fall through to the generic fetch below (which
// Instagram also blocks), and then to no preview at all.
const OEMBED_PROVIDERS = [
  { test: (u) => /(^|\.)youtube\.com$|^youtu\.be$/.test(u.hostname), endpoint: (u) => `https://www.youtube.com/oembed?url=${encodeURIComponent(u.href)}&format=json` },
  { test: (u) => /(^|\.)tiktok\.com$/.test(u.hostname), endpoint: (u) => `https://www.tiktok.com/oembed?url=${encodeURIComponent(u.href)}` },
  { test: (u) => /(^|\.)vimeo\.com$/.test(u.hostname), endpoint: (u) => `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(u.href)}` },
  { test: (u) => /(^|\.)(twitter\.com|x\.com)$/.test(u.hostname), endpoint: (u) => `https://publish.twitter.com/oembed?url=${encodeURIComponent(u.href)}` },
]

function normalizeUrl(raw) {
  const trimmed = raw.trim()
  if (!trimmed) return null
  try {
    return new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`)
  } catch {
    return null
  }
}

async function fetchOEmbed(url) {
  const provider = OEMBED_PROVIDERS.find(p => p.test(url))
  if (!provider) return null
  try {
    const res = await fetch(provider.endpoint(url))
    if (!res.ok) return null
    const data = await res.json()
    if (!data.thumbnail_url && !data.title) return null
    return { image: data.thumbnail_url || null, title: data.title || null }
  } catch {
    return null
  }
}

// Generic fallback for links with no oEmbed support (blogs, Booking.com,
// Google Maps, etc.) — a server-side function scrapes Open Graph tags,
// since fetching arbitrary HTML from the browser hits CORS almost
// everywhere. Sites that block bots (Instagram included) just return
// nothing here, same as any other failure.
async function fetchOpenGraph(url) {
  try {
    const res = await fetch(`/link-preview?url=${encodeURIComponent(url.href)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (!data.image && !data.title) return null
    return data
  } catch {
    return null
  }
}

// Never throws — a failed or unsupported link just means no preview,
// which is the graceful-degradation contract the save flow depends on.
export async function fetchLinkPreview(rawUrl) {
  const url = normalizeUrl(rawUrl)
  if (!url) return null
  return (await fetchOEmbed(url)) || (await fetchOpenGraph(url))
}
