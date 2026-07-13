import { useState, useRef, useEffect } from 'react'
import { TEXT, COLORS } from '../styles'
import { askGemini, parseAIResponse } from '../gemini'

const SUGGESTION_CHIPS = [
  'How many days do we need at our destination?',
  'What is a realistic budget for a group trip?',
  'What should we book in advance?',
]

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

export function AIScreen() {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [sending, setSending]   = useState(false)
  const bottomRef               = useRef(null)

  const showEmptyState = messages.length === 0 && input === ''

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (override) => {
    const text = (override ?? input).trim()
    if (!text || sending) return
    const userMsg = { id: Date.now(), role: 'user', text }
    const loadingId = Date.now() + 1
    setMessages(prev => [...prev, userMsg, { id: loadingId, role: 'ai', loading: true }])
    setInput('')
    setSending(true)

    try {
      const raw = await askGemini(text)
      const { text: aiText, questions } = parseAIResponse(raw)
      setMessages(prev => prev.map(m => m.id === loadingId ? { id: loadingId, role: 'ai', text: aiText, questions } : m))
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
              {SUGGESTION_CHIPS.map((q, i) => (
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
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
              }}>
                ✨
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{
                  background: COLORS.sand, color: COLORS.charcoal,
                  borderRadius: '4px 16px 16px 16px',
                  padding: '12px 16px', fontSize: 14, lineHeight: 1.6, fontWeight: 500,
                  borderLeft: `3px solid ${COLORS.teal}66`,
                }}>
                  {msg.loading ? <TypingDots /> : msg.text}
                </div>

                {/* Follow-up question chips */}
                {msg.questions && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {msg.questions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        disabled={sending}
                        style={{
                          background: 'white', border: `1.5px solid ${COLORS.teal}`,
                          borderRadius: 20, padding: '8px 12px',
                          fontSize: 13, fontWeight: 600, color: COLORS.teal,
                          cursor: sending ? 'default' : 'pointer', textAlign: 'left',
                          maxWidth: '100%',
                        }}
                      >
                        {q}
                      </button>
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
            background: canSend ? COLORS.teal : COLORS.border,
            color: canSend ? 'white' : '#A79E93',
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
