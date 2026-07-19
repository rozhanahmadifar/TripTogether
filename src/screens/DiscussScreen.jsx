import { useRef, useState } from 'react'
import { buildSimulatedThreadMessages } from '../discuss'
import { COLORS, SPACING, SHADOW_CARD } from '../styles'
import { useLongPress } from '../hooks/useLongPress'

function ChatBubbleIcon({ size = 20, color = COLORS.teal }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.35 0-2.62-.32-3.75-.9L3 20l1.05-4.2A8.44 8.44 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3h1A8.5 8.5 0 0 1 21 11.5Z" />
    </svg>
  )
}

// Every trip has exactly one auto-created discussion thread, always pinned —
// there is no way to create another, so no per-thread delete menu is needed.
function ThreadCard({ thread, messages, onOpen, onLongPressPinned }) {
  const cardRef = useRef(null)
  const last = messages[messages.length - 1]

  const longPress = useLongPress(() => onLongPressPinned())

  return (
    <button
      ref={cardRef}
      {...longPress}
      onClick={onOpen}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: COLORS.cardBg, borderRadius: 14, padding: 16,
        boxShadow: SHADOW_CARD, border: 'none',
        borderLeft: `3px solid ${COLORS.teal}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <ChatBubbleIcon />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.charcoal, display: 'flex', alignItems: 'center', gap: 5 }}>
              📌 {thread.title}
            </span>
            <span style={{ fontSize: 12, color: COLORS.warmGrey, flexShrink: 0 }}>
              {messages.length} {messages.length === 1 ? 'reply' : 'replies'}
            </span>
          </div>
          {thread.subtext && (
            <p style={{ fontSize: 12, color: COLORS.warmGrey, fontStyle: 'italic', marginTop: 2, marginBottom: 8 }}>
              {thread.subtext}
            </p>
          )}
          <p style={{
            fontSize: 13, color: COLORS.warmGrey, fontStyle: last ? 'normal' : 'italic',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {last ? `${last.name}: ${last.text}` : 'No messages yet'}
          </p>
        </div>
      </div>
    </button>
  )
}

export function DiscussScreen({ navigate, currentTrip, discussMessages, customThreads }) {
  const tripMembers = currentTrip?.members || []
  const [toast, setToast] = useState('')

  if (!currentTrip) {
    return (
      <div className="screen" style={{ background: COLORS.bgGroupSpace }}>
        <div style={{ padding: '20px 20px 16px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.4, marginBottom: 6 }}>
            Group Discussions
          </h1>
          <p style={{ fontSize: 14, color: COLORS.warmGrey }}>Talk through your plans together</p>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: COLORS.warmGrey, lineHeight: 1.5 }}>
            Create a group trip to start discussing plans together.
          </p>
        </div>
      </div>
    )
  }

  const threads = customThreads[currentTrip.id] || []

  const getMessages = (thread) => {
    const simulated = buildSimulatedThreadMessages(thread.pinned, tripMembers)
    const sent = (discussMessages && discussMessages[`${currentTrip.id}-${thread.id}`]) || []
    return [...simulated, ...sent]
  }

  const showToast = (text) => {
    setToast(text)
    setTimeout(() => setToast(''), 2200)
  }

  return (
    <div className="screen" style={{ background: COLORS.bgGroupSpace }}>
      <div style={{ padding: '20px 20px 16px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.4, marginBottom: 6 }}>
          Group Discussions
        </h1>
        <p style={{ fontSize: 14, color: COLORS.warmGrey }}>Talk through your plans together</p>
      </div>

      <div className="screen-scroll" style={{ padding: `0 ${SPACING.screenX}px ${SPACING.scrollBottomPad}px` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {threads.map(thread => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              messages={getMessages(thread)}
              onOpen={() => navigate('discussThread', { threadId: thread.id, backTo: 'discuss' })}
              onLongPressPinned={() => showToast(`The ${thread.title} discussion cannot be deleted.`)}
            />
          ))}
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'absolute', bottom: 96, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(26,26,26,0.92)', color: 'white', fontSize: 13, fontWeight: 600,
          padding: '10px 16px', borderRadius: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          zIndex: 200, textAlign: 'center', maxWidth: '80%',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
