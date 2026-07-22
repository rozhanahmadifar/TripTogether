const CORS_HEADERS = { 'Access-Control-Allow-Origin': '*' }

function extractMeta(html, property) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${property}["']`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return match[1]
  }
  return null
}

// Fetches the target page server-side (avoiding the CORS wall a browser
// fetch would hit for arbitrary sites) and scrapes its Open Graph tags.
// Always resolves 200 with whatever it found, even nothing — a missing
// preview is a normal, expected outcome (bot-blocking sites, dead links),
// not an error the caller needs to handle specially.
export async function onRequestGet(context) {
  try {
    const target = new URL(context.request.url).searchParams.get('url')
    if (!target) throw new Error('Missing url parameter')

    const parsed = new URL(target)
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported protocol')

    const response = await fetch(parsed.href, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TripTogetherLinkPreview/1.0)' },
      redirect: 'follow',
    })
    if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`)

    const html = await response.text()
    const image = extractMeta(html, 'og:image')
    const title = extractMeta(html, 'og:title') || extractMeta(html, 'twitter:title')

    return new Response(JSON.stringify({ image, title }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ image: null, title: null }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
}
