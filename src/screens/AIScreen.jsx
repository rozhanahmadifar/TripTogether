import { useState, useRef, useEffect } from 'react'
import { TEXT, COLORS, SPACING } from '../styles'
import { askGemini, parseAIResponse, buildTripContextBlock } from '../gemini'
import { AIIntroIllustration } from '../components/Illustrations'

function PlaneIcon({ size = 16, color = COLORS.teal }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M21 3 3 10.5l6.5 2 2 6.5L15 13l6-10Z" />
    </svg>
  )
}

function ChipPeopleIcon({ size = 16, color = COLORS.teal }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14.2c2.4.5 4.5 2.6 4.5 5.8" />
    </svg>
  )
}

function WeatherIcon({ size = 16, color = COLORS.teal }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M7 18a4.5 4.5 0 0 1-.4-9 6.5 6.5 0 0 1 12.4 2c0 .1 0 .3 0 .4A3.5 3.5 0 0 1 19.5 18H7Z" />
    </svg>
  )
}

function ChevronIcon({ size = 16, color = COLORS.subtleIcon }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

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
// generic version of itself. `type` picks which icon a chip renders with.
function buildOpeningChips(currentTrip) {
  const destination = currentTrip?.destination?.trim()
  const count = currentTrip?.members?.length
  const when = dayBucket(currentTrip?.startDate)

  const chips = []
  if (destination) chips.push({ type: 'visa', text: `Do we need a visa for ${destination}?` })
  if (count) chips.push({ type: 'discount', text: `Are there group discounts for ${count} people?` })
  if (destination && when) chips.push({ type: 'weather', text: `What is the weather like in ${destination} in ${when}?` })
  return chips
}

const CHIP_ICONS = { visa: PlaneIcon, discount: ChipPeopleIcon, weather: WeatherIcon }

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
    } catch (err) {
      // The backend returns a specific, actionable message for known
      // failure cases (missing key, timeout) — show that instead of the
      // generic fallback whenever we have one.
      setMessages(prev => prev.map(m => m.id === loadingId ? { id: loadingId, role: 'ai', text: err.message || ERROR_TEXT } : m))
    } finally {
      setSending(false)
    }
  }

  const canSend = input.trim().length > 0 && !sending

  return (
    <div className="screen" style={{ background: 'white' }}>
      {/* Header — no divider beneath it; whitespace alone separates it
          from the chat area below, matching My Trips' header treatment. */}
      <div style={{ padding: '16px 20px 14px', flexShrink: 0 }}>
        <h1 style={{ ...TEXT.screenTitle, marginBottom: SPACING.headingGap }}>
          Ask the AI ✨
        </h1>
        <p style={TEXT.subtext}>
          Ask me anything about your trip.
        </p>
      </div>

      {/* Chat scroll area */}
      <div className="screen-scroll" style={{ padding: '16px 20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {showEmptyState && (
          <div style={{ paddingTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ marginBottom: 16 }}>
              <AIIntroIllustration />
            </div>
            {/* One line here, not two — the header subtitle above already
                covers "ask me anything about your trip", so this is just
                the single prompt, not a restatement of it. */}
            <p style={{ fontSize: 18, fontWeight: 700, color: COLORS.charcoal, marginBottom: 28, letterSpacing: -0.2 }}>
              What would you like to know?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              {suggestionChips.map((chip, i) => {
                const Icon = CHIP_ICONS[chip.type]
                return (
                  <button
                    key={i}
                    onClick={() => sendMessage(chip.text)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: 'white', border: `1.5px solid ${COLORS.teal}`,
                      borderRadius: 12, padding: '12px 14px',
                      fontSize: 14, fontWeight: 600, color: COLORS.charcoal,
                      textAlign: 'left', cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      background: COLORS.tealTint,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon />
                    </div>
                    <span style={{ flex: 1 }}>{chip.text}</span>
                    <ChevronIcon />
                  </button>
                )
              })}
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
