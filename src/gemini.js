const SYSTEM_PROMPT = `You are a friendly and knowledgeable travel planning assistant inside a collaborative group travel planning app called TripTogether. Help groups plan trips together with practical and specific advice. Write your main answer in 3 to 4 sentences. Be specific and practical. Then write exactly two follow-up questions the user might want to ask next. Each question must start with QUESTION: on its own line. Make the questions specific to what was just discussed. Do not write SAVE: or ACTION: or any other labels. Only QUESTION: is allowed as a label. Do not use dashes or em dashes in your responses. Use commas or full stops instead.`

export async function askGemini(userMessage) {
  const response = await fetch('/netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', text: userMessage }],
      systemPrompt: SYSTEM_PROMPT,
    }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data?.error || 'Gemini request failed')

  return data.candidates[0].content.parts.map(p => p.text).join('')
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

    const text = stripMarkdown(textLines.join(' ').trim())
    if (!text) throw new Error('no main answer text after parsing')

    return {
      text,
      questions: questions.length ? questions.slice(0, 2) : undefined,
    }
  } catch {
    return { text: stripMarkdown(raw.trim()) }
  }
}
