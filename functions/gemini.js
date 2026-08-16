const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent'

// Each Gemini call gets its own hard timeout so a slow upstream response
// can never combine with the grounding fallback below to outlast
// Cloudflare's own edge timeout (~100s) — when that happens, Cloudflare's
// proxy returns a plain "error code: 524" text page instead of anything
// this function controls, which breaks the client's response.json() parse
// and shows up as an opaque failure with no useful message.
const REQUEST_TIMEOUT_MS = 15000

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

// Null on any failure (network error or timeout) rather than throwing, so
// the caller can fall back to a second attempt the same way it already
// does for a non-OK HTTP response.
async function tryCallGemini(apiKey, body) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

export async function onRequestPost(context) {
  try {
    const apiKey = context.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured')

    const { messages, systemPrompt } = await context.request.json()
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Request body must include a non-empty messages array')
    }

    const baseBody = {
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
      ...(systemPrompt ? { systemInstruction: { parts: [{ text: systemPrompt }] } } : {}),
      // Extended "thinking" pushes response times past the platform's
      // function timeout often enough to matter, so it's disabled here.
      generationConfig: { thinkingConfig: { thinkingBudget: 0 } },
    }

    // Try grounding answers in real Google Search results first, so citation
    // links point at actual pages instead of the model's own guesses.
    // Grounding has its own, tighter quota separate from plain generation —
    // a 429 there means the whole API key is under quota pressure right
    // now (confirmed in production: a grounded 429 was consistently
    // followed by the plain fallback call hanging for the full timeout
    // instead of failing fast), so that's reported immediately rather than
    // spending another full timeout on a retry likely to fail the same
    // way. Any other grounding failure — network error, timeout, a non-429
    // error — still falls back to a plain ungrounded answer, since that's
    // usually a grounding-specific hiccup rather than account-wide
    // throttling, and the system prompt already tells the model to say
    // when it has no verified source.
    let response = await tryCallGemini(apiKey, { ...baseBody, tools: [{ google_search: {} }] })
    if (response?.status === 429) {
      return new Response(JSON.stringify({ error: 'The AI is getting a lot of requests right now. Please wait a few seconds and try again.' }), {
        status: 429,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }
    if (!response || !response.ok) {
      response = await tryCallGemini(apiKey, baseBody)
    }
    if (!response) {
      return new Response(JSON.stringify({ error: 'The AI took too long to respond. Try a shorter or more specific question.' }), {
        status: 504,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    if (!response.ok) throw new Error(data?.error?.message || 'Gemini API request failed')

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Something went wrong' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
}
