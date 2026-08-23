import { useRef, useState } from 'react'
import { buildSimulatedThreadMessages } from '../discuss'
import { COLORS, SPACING, SHADOW_CARD } from '../styles'
import { CATEGORY_PHOTOS } from '../data'
import { useLongPress } from '../hooks/useLongPress'
import { DiscussEmptyIllustration } from '../components/Illustrations'

function ChatBubbleIcon({ size = 20, color = COLORS.teal }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.35 0-2.62-.32-3.75-.9L3 20l1.05-4.2A8.44 8.44 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3h1A8.5 8.5 0 0 1 21 11.5Z" />
    </svg>
  )
}

function ChevronIcon({ size = 14, color = COLORS.subtleIcon }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

// Tiny overlapping avatar cluster meant to sit inline next to the reply
// count rather than as its own row — kept local and sized down from
// MyTripsScreen's CompactAvatars, which is built for a full-width row.
function CompactThreadAvatars({ members, max = 3 }) {
  if (!members || members.length === 0) return null
  const shown = members.slice(0, max)
  const overflow = members.length - shown.length
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((m, i) => (
        <div key={m.id} title={m.name} style={{
          width: 18, height: 18, borderRadius: '50%', background: m.color,
          border: '1.5px solid white', marginLeft: i > 0 ? -6 : 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 8, fontWeight: 700, color: 'white', lineHeight: 1, flexShrink: 0,
        }}>
          {m.initial}
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: COLORS.warmGrey,
          border: '1.5px solid white', marginLeft: -6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 8, fontWeight: 700, color: 'white', lineHeight: 1, flexShrink: 0,
        }}>
          +{overflow}
        </div>
      )}
    </div>
  )
}

// Every trip has exactly one auto-created discussion thread, always pinned —
// there is no way to create another, so no per-thread delete menu is needed.
function ThreadCard({ displayTitle, destination, members, messages, onOpen, onLongPressPinned }) {
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
        background: COLORS.cardBg, borderRadius: 14, padding: 14,
        boxShadow: SHADOW_CARD, border: 'none',
      }}
    >
      <div style={{ display: 'flex', gap: 12 }}>
        {destination && (
          <img
            src={CATEGORY_PHOTOS.destination}
            alt=""
            style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Avatars + reply count share this row with the title instead of
              stacking as their own row underneath — that's what stretched
              this card taller than My Trips' equivalent-height row card. */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{
              flex: 1, minWidth: 0, fontSize: 15, fontWeight: 700, color: COLORS.charcoal,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <ChatBubbleIcon size={15} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayTitle}</span>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <CompactThreadAvatars members={members} />
              <span style={{ fontSize: 11, color: COLORS.warmGrey, fontWeight: 600 }}>
                {messages.length} {messages.length === 1 ? 'reply' : 'replies'}
              </span>
              <ChevronIcon />
            </div>
          </div>

          {destination && (
            <p style={{ fontSize: 12, color: COLORS.warmGrey, fontWeight: 500, marginTop: 3, marginBottom: 5 }}>
              📍 {destination}
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
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 ${SPACING.screenX}px` }}>
          <div style={{
            width: '100%', textAlign: 'center', padding: '40px 24px 32px',
            background: 'white', borderRadius: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <DiscussEmptyIllustration size={160} />
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: COLORS.charcoal, marginBottom: 8, letterSpacing: -0.3 }}>
              No discussions yet
            </p>
            <p style={{ fontSize: 14, color: COLORS.warmGrey, lineHeight: 1.5, fontWeight: 400, maxWidth: 260, marginLeft: 'auto', marginRight: 'auto' }}>
              Once you start planning a trip with your crew, your conversations will show up here.
            </p>
          </div>
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
          {threads.map(thread => {
            // The pinned thread's title is frozen at trip-creation time and
            // goes stale after a rename — it always tracks this one trip, so
            // its display title comes from the trip's current name instead.
            // A hypothetical future non-pinned thread keeps its own title.
            const displayTitle = thread.pinned ? (currentTrip.name || 'My Trip') : thread.title
            return (
              <ThreadCard
                key={thread.id}
                displayTitle={displayTitle}
                destination={currentTrip.destination}
                members={tripMembers}
                messages={getMessages(thread)}
                onOpen={() => navigate('discussThread', { threadId: thread.id, backTo: 'discuss' })}
                onLongPressPinned={() => showToast(`The ${displayTitle} discussion cannot be deleted.`)}
              />
            )
          })}
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
