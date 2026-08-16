const SYSTEM_PROMPT = `You are a practical logistics assistant inside a collaborative group travel planning app called TripTogether.

Scope: only answer practical, factual, logistics-type travel questions, such as discounts, transport rules, visa and entry requirements, booking deadlines, and group ticket options. Never suggest specific restaurants, activities, attractions, or "best" places to visit, eat, or stay, and never give general recommendation-style answers. If asked for a recommendation, say that is outside what you help with, and offer to help with a logistics angle instead.

Format: write your answer as short bullet points or numbered steps, not long paragraphs. Keep it brief and scannable.

Honesty: if a question involves information that varies by season, provider, or that you are not confident about, say so plainly and suggest the user check the relevant official source, instead of answering confidently. When you reference a fact found via search, prefer official government, transit authority, or provider sources. If you do not have a verified source for a claim, say so rather than naming a source with nothing to back it up.

Do not use dashes or em dashes in your responses. Use commas or full stops instead.`

// Trip facts get their own labeled block so the model can use them
// automatically without the user having to retype them.
export function buildTripContextBlock(currentTrip) {
  const facts = []
  if (currentTrip?.destination) facts.push(`Destination: ${currentTrip.destination}`)
  if (currentTrip?.dates) facts.push(`Dates: ${currentTrip.dates}`)
  const count = currentTrip?.members?.length
  if (count) facts.push(`Number of travelers: ${count}`)

  if (facts.length === 0) {
    return 'Trip facts: none are set yet. Do not invent a destination, dates, or traveler count.'
  }
  return `Trip facts (already known, use automatically, do not ask the user to repeat them):\n${facts.join('\n')}`
}

export async function askGemini(history, tripContextBlock) {
  const response = await fetch('/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: history,
      systemPrompt: `${SYSTEM_PROMPT}\n\n${tripContextBlock}`,
    }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data?.error || 'Gemini request failed')

  const candidate = data.candidates[0]
  const text = candidate.content.parts.map(p => p.text).join('')
  return { text, sources: extractSources(candidate) }
}

// Only real, search-grounded links are ever surfaced — deduped by URL. When
// grounding wasn't available for this answer (quota, billing, transient
// failure — see the gemini function's fallback), this is simply empty and
// no source list renders, rather than fabricating one.
function extractSources(candidate) {
  const chunks = candidate?.groundingMetadata?.groundingChunks || []
  const seen = new Set()
  const sources = []
  for (const chunk of chunks) {
    const uri = chunk.web?.uri
    if (!uri || seen.has(uri)) continue
    seen.add(uri)
    sources.push({ uri, title: chunk.web?.title || uri })
  }
  return sources
}

// Bubbles render plain text, so strip markdown emphasis Gemini sometimes adds.
const stripMarkdown = (s) => s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/__(.*?)__/g, '$1')

export function parseAIResponse(raw) {
  return { text: stripMarkdown(raw.trim()) }
}
