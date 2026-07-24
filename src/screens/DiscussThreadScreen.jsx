import { useState, useRef, useEffect } from 'react'
import { BackButton } from '../components/BackButton'
import { DEFAULT_THREAD, buildSimulatedThreadMessages } from '../discuss'
import { colorForName } from '../data'
import { COLORS } from '../styles'

export function DiscussThreadScreen({ navigate, params = {}, currentTrip, userName, discussMessages, addDiscussMessage, customThreads }) {
  const { threadId } = params
  const threads = currentTrip ? (customThreads?.[currentTrip.id] || []) : []
  const thread = threads.find(t => t.id === threadId) || DEFAULT_THREAD
  const tripMembers = currentTrip?.members || []
  const [text, setText] = useState('')
  const listRef = useRef(null)

  const simulated = buildSimulatedThreadMessages(thread.pinned, tripMembers)
  const sent = (currentTrip && discussMessages[`${currentTrip.id}-${thread.id}`]) || []
  const messages = [...simulated, ...sent]

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const getMe = () => ({
    name: userName || 'You', color: colorForName(userName || 'You'), initial: (userName || 'You').charAt(0).toUpperCase(),
  })

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || !currentTrip) return
    const me = getMe()
    addDiscussMessage(currentTrip.id, thread.id, {
      id: `msg-${Date.now()}`, name: me.name, color: me.color, initial: me.initial,
      text: trimmed, timestamp: 'Just now',
    })
    setText('')
  }

  const canSend = text.trim().length > 0

  return (
    <div className="screen" style={{ background: 'white' }}>
      <div style={{
        padding: '16px 20px 14px', display: 'flex', alignItems: 'center',
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <BackButton onClick={() => navigate(params.backTo || 'discuss')} />
        <p style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 600, color: COLORS.charcoal }}>
          {thread.title}
        </p>
        <div style={{ width: 36, flexShrink: 0 }} />
      </div>

      <div ref={listRef} className="screen-scroll" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 14, color: COLORS.warmGrey, lineHeight: 1.5, fontWeight: 500 }}>
              No messages yet.<br />Start the conversation.
            </p>
          </div>
        ) : messages.map(m => (
          <div key={m.id} style={{ display: 'flex', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: m.color, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white',
            }}>
              {m.initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.charcoal }}>{m.name}</span>
                <span style={{ fontSize: 12, color: COLORS.warmGrey }}>{m.timestamp}</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 400, color: COLORS.charcoal, lineHeight: 1.5 }}>{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: '12px 16px', borderTop: `1px solid ${COLORS.border}`, background: 'white',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Say something to the group"
          style={{
            flex: 1, minHeight: 44, borderRadius: 20,
            border: `1.5px solid ${COLORS.border}`, padding: '0 16px',
            fontSize: 14, color: COLORS.charcoal, background: COLORS.bgGroupSpace,
            fontFamily: 'inherit', minWidth: 0,
          }}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none',
            background: COLORS.action, color: 'white',
            fontSize: 15, cursor: canSend ? 'pointer' : 'default', opacity: canSend ? 1 : 0.6,
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ↑
        </button>
      </div>
    </div>
  )
}
