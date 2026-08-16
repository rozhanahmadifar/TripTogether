import { useState, useRef, useEffect } from 'react'
import { TEXT, COLORS } from '../styles'
import { askGemini, parseAIResponse, buildTripContextBlock } from '../gemini'

// Natural-language stand-in for the trip's start date since the trip only
// stores a startDate ISO string (no endDate) — "late August" rather than
// a raw date, bucketed to which third of the month the trip starts in.
function dayBucket(startDate) {
  if (!startDate) return null
  const d = new Date(startDate)
  if (Number.isNaN(d.getTime())) return null
  const month = d.toLocaleString('en-US', { month: 'long' })
  const day = d.getDate()
  const part = day <= 10 ? 'early' : day <= 20 ? 'mid' : 'late'
  return `${part} ${month}`
}

// Opening chips only — one fixed template per fact (visa/destination, group
// discount/member count, weather/destination+when), each omitted outright
// when its underlying trip data isn't set, rather than falling back to a
// generic version of itself.
function buildOpeningChips(currentTrip) {
  const destination = currentTrip?.destination?.trim()
  const count = currentTrip?.members?.length
  const when = dayBucket(currentTrip?.startDate)

  const chips = []
  if (destination) chips.push(`Do we need a visa for ${destination}?`)
  if (count) chips.push(`Are there group discounts for ${count} people?`)
  if (destination && when) chips.push(`What is the weather like in ${destination} in ${when}?`)
  return chips
}

const ERROR_TEXT = 'Sorry, I could not connect right now. Please try again in a moment.'

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '4px 2px' }}>
      {[0, 1, 2].map(i => (
        <span key={i} className="ai-typing-dot" style={{ color: COLORS.warmGrey, animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  )
}

export function AIScreen({ currentTrip }) {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [sending, setSending]   = useState(false)
  const bottomRef               = useRef(null)
  const suggestionChips         = buildOpeningChips(currentTrip)
  const tripContextBlock        = buildTripContextBlock(currentTrip)

  const showEmptyState = messages.length === 0 && input === ''

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (override) => {
    const text = (override ?? input).trim()
    if (!text || sending) return
    const userMsg = { id: Date.now(), role: 'user', text }
    const loadingId = Date.now() + 1
    // Full prior conversation goes with every call — not just the latest
    // message — so the model can pick up facts the user already stated
    // earlier (e.g. "we're students") in its answer.
    const history = [...messages, userMsg]
      .filter(m => !m.loading)
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', text: m.text }))
    setMessages(prev => [...prev, userMsg, { id: loadingId, role: 'ai', loading: true }])
    setInput('')
    setSending(true)

    try {
      const { text: raw, sources } = await askGemini(history, tripContextBlock)
      const { text: aiText } = parseAIResponse(raw)
      setMessages(prev => prev.map(m => m.id === loadingId ? { id: loadingId, role: 'ai', text: aiText, sources } : m))
    } catch {
      setMessages(prev => prev.map(m => m.id === loadingId ? { id: loadingId, role: 'ai', text: ERROR_TEXT } : m))
    } finally {
      setSending(false)
    }
  }

  const canSend = input.trim().length > 0 && !sending

  return (
    <div className="screen" style={{ background: 'white' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 14px', borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.4, marginBottom: 8 }}>
          Ask the AI ✨
        </h1>
        <p style={TEXT.subtext}>
          Ask me anything about your trip. I am here to help.
        </p>
      </div>

      {/* Chat scroll area */}
      <div className="screen-scroll" style={{ padding: '16px 20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {showEmptyState && (
          <div style={{ paddingTop: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: 48, marginBottom: 16 }}>✨</span>
            <p style={{ fontSize: 18, fontWeight: 600, color: COLORS.charcoal, marginBottom: 8, letterSpacing: -0.2 }}>
              What would you like to know?
            </p>
            <p style={{ fontSize: 14, color: COLORS.warmGrey, lineHeight: 1.5, marginBottom: 28, maxWidth: 260 }}>
              Ask me anything about your trip and I will help you think it through.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              {suggestionChips.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  style={{
                    background: 'white', border: `1.5px solid ${COLORS.teal}`,
                    borderRadius: 12, padding: 14,
                    fontSize: 14, fontWeight: 600, color: COLORS.teal,
                    textAlign: 'left', cursor: 'pointer',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg =>
          msg.role === 'user' ? (
            <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                background: COLORS.teal, color: 'white',
                borderRadius: '16px 16px 4px 16px',
                padding: '12px 16px', fontSize: 14, lineHeight: 1.55, fontWeight: 500,
                maxWidth: '82%',
              }}>
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-start', gap: 10, maxWidth: '90%' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: COLORS.terracotta,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, lineHeight: 1,
              }}>
                ✨
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{
                  background: COLORS.sand, color: COLORS.charcoal,
                  borderRadius: '4px 16px 16px 16px',
                  padding: '12px 16px', fontSize: 14, lineHeight: 1.6, fontWeight: 500,
                  borderLeft: `3px solid ${COLORS.teal}66`,
                  whiteSpace: 'pre-line',
                }}>
                  {msg.loading ? <TypingDots /> : msg.text}
                </div>

                {/* Real, search-grounded source links only — never a bare
                    source name with nothing to click, and never shown at
                    all when grounding wasn't available for this answer. */}
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 2 }}>
                    {msg.sources.map((s, i) => (
                      <a
                        key={i}
                        href={s.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 12, fontWeight: 600, color: COLORS.teal,
                          textDecoration: 'underline', wordBreak: 'break-word',
                        }}
                      >
                        🔗 {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: '10px 16px 16px',
        borderTop: `1px solid ${COLORS.border}`,
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything about your trip…"
          style={{
            flex: 1, minHeight: 48, borderRadius: 14,
            border: `1.5px solid ${COLORS.border}`, padding: '0 16px',
            fontSize: 14, color: COLORS.charcoal, background: COLORS.bgMyIdeas,
            fontFamily: 'inherit', minWidth: 0,
          }}
        />
        <button
          onClick={() => sendMessage()}
          style={{
            width: 48, height: 48, borderRadius: '50%', border: 'none',
            background: canSend ? COLORS.action : COLORS.border,
            color: canSend ? 'white' : COLORS.warmGrey, lineHeight: 1,
            fontSize: 20, cursor: canSend ? 'pointer' : 'default',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ↑
        </button>
      </div>
    </div>
  )
}
