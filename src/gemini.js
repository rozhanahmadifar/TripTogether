const SYSTEM_PROMPT = `You are a practical logistics assistant inside a collaborative group travel planning app called TripTogether.

Scope: only answer practical, factual, logistics-type travel questions, such as discounts, transport rules, visa and entry requirements, booking deadlines, and group ticket options. Never suggest specific restaurants, activities, attractions, or "best" places to visit, eat, or stay, and never give general recommendation-style answers. If asked for a recommendation, say that is outside what you help with, and offer to help with a logistics angle instead.

Format: write your answer as short bullet points or numbered steps, not long paragraphs. Keep it brief and scannable.

Honesty: if a question involves information that varies by season, provider, or that you are not confident about, say so plainly and suggest the user check the relevant official source, instead of answering confidently. When you reference a fact found via search, prefer official government, transit authority, or provider sources. If you do not have a verified source for a claim, say so rather than naming a source with nothing to back it up.

Follow-up questions: after your answer, write exactly two short follow-up questions, each on its own line starting with QUESTION:. A follow-up question may only mention a specific date, month, destination, number of travelers, or traveler type (such as student or senior) if that exact detail was given in the trip facts below or stated earlier in this conversation by the user. Otherwise keep follow-up questions fully generic and do not invent any such detail.

Do not use dashes or em dashes in your responses. Use commas or full stops instead.`

// Trip facts get their own labeled block so the model can use them without
// the user retyping them, and so it has a concrete, checkable list of "what
// counts as already known" when deciding what a follow-up question may name.
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

// Bubbles and chips render plain text, so strip markdown emphasis Gemini sometimes adds.
const stripMarkdown = (s) => s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/__(.*?)__/g, '$1')

// Parses the QUESTION: structure. If the model deviates from the format
// badly enough that no main answer text is left, fall back to showing the
// raw response as a plain bubble rather than guessing.
export function parseAIResponse(raw) {
  try {
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean)
    const questions = []

    const textLines = lines.filter(line => {
      if (line.startsWith('QUESTION:')) { questions.push(stripMarkdown(line.slice(9).trim())); return false }
      return true
    })

    // Joined with newlines, not spaces, so bullet points and numbered
    // steps the model wrote on separate lines stay on separate lines.
    const text = stripMarkdown(textLines.join('\n').trim())
    if (!text) throw new Error('no main answer text after parsing')

    return {
      text,
      questions: questions.length ? questions.slice(0, 2) : undefined,
    }
  } catch {
    return { text: stripMarkdown(raw.trim()) }
  }
}
