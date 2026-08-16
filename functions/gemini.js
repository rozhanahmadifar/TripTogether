const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent'

// Each Gemini call gets its own hard timeout so a slow upstream response
// can never combine with the grounding fallback below to outlast
// Cloudflare's own edge timeout (~100s) — when that happens, Cloudflare's
// proxy returns a plain "error code: 524" text page instead of anything
// this function controls, which breaks the client's response.json() parse
// and shows up as an opaque failure with no useful message.
const REQUEST_TIMEOUT_MS = 20000

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
async function tryCallGemini(apiKey, body, label, debugLog) {
  const start = Date.now()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    debugLog.push({ label, ms: Date.now() - start, status: res.status })
    return res
  } catch (err) {
    debugLog.push({ label, ms: Date.now() - start, error: err.name === 'AbortError' ? 'timeout' : err.message })
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
    // links point at actual pages instead of the model's own guesses. Search
    // grounding is billed and rate-limited separately from plain generation
    // though, so if it's unavailable (quota, billing, transient error, or
    // simply too slow) we fall back to an ungrounded answer rather than
    // failing the whole request — the system prompt tells the model to say
    // when it has no verified source, which covers this case honestly
    // either way.
    const debugLog = []
    let response = await tryCallGemini(apiKey, { ...baseBody, tools: [{ google_search: {} }] }, 'grounded', debugLog)
    if (!response || !response.ok) {
      response = await tryCallGemini(apiKey, baseBody, 'fallback', debugLog)
    }
    if (!response) {
      return new Response(JSON.stringify({ error: 'The AI took too long to respond. Try a shorter or more specific question.', debugLog }), {
        status: 504,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    if (!response.ok) throw new Error(`${data?.error?.message || 'Gemini API request failed'} | debug=${JSON.stringify(debugLog)}`)

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
