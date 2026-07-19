const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured')

    const { messages, systemPrompt } = JSON.parse(event.body || '{}')
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Request body must include a non-empty messages array')
    }

    const baseBody = {
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
      ...(systemPrompt ? { systemInstruction: { parts: [{ text: systemPrompt }] } } : {}),
      // Extended "thinking" pushes response times past Netlify's function
      // timeout often enough to matter, so it's disabled here.
      generationConfig: { thinkingConfig: { thinkingBudget: 0 } },
    }

    const callGemini = (body) => fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    // Try grounding answers in real Google Search results first, so citation
    // links point at actual pages instead of the model's own guesses. Search
    // grounding is billed and rate-limited separately from plain generation
    // though, so if it's unavailable (quota, billing, transient error) we
    // fall back to an ungrounded answer rather than failing the whole
    // request — the system prompt tells the model to say when it has no
    // verified source, which covers this case honestly either way.
    let response = await callGemini({ ...baseBody, tools: [{ google_search: {} }] })
    if (!response.ok) {
      response = await callGemini(baseBody)
    }

    const data = await response.json()
    if (!response.ok) throw new Error(data?.error?.message || 'Gemini API request failed')

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Something went wrong' }),
    }
  }
}
