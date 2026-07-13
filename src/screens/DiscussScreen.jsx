import { useRef, useState } from 'react'
import { DEFAULT_THREAD, GENERAL_THREAD_ID, buildSimulatedThreadMessages } from '../discuss'
import { COLORS, SPACING, SHADOW_CARD } from '../styles'
import { useLongPress } from '../hooks/useLongPress'
import { ActionMenu, TrashIcon } from '../components/ActionMenu'

function ChatBubbleIcon({ size = 20, color = COLORS.teal }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.35 0-2.62-.32-3.75-.9L3 20l1.05-4.2A8.44 8.44 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3h1A8.5 8.5 0 0 1 21 11.5Z" />
    </svg>
  )
}

function NewThreadSheet({ onCreate, onClose }) {
  const [title, setTitle] = useState('')
  const canCreate = title.trim().length > 0

  const handleCreate = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    onCreate(trimmed)
  }

  return (
    <div
      style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="comment-sheet-slide" style={{
        background: 'white', borderRadius: '20px 20px 0 0', width: '100%',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)', padding: '12px 20px 24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#D4C9BE' }} />
        </div>
        <p style={{ fontSize: 17, fontWeight: 700, color: COLORS.charcoal, marginBottom: 14 }}>
          What do you want to discuss?
        </p>
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          placeholder="Name your discussion topic"
          style={{
            width: '100%', minHeight: SPACING.inputMinHeight, borderRadius: 12,
            border: `1.5px solid ${COLORS.border}`, padding: '0 16px',
            fontSize: 14, color: COLORS.charcoal, background: COLORS.bgGroupSpace,
            fontFamily: 'inherit', marginBottom: 14, boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleCreate}
          disabled={!canCreate}
          style={{
            width: '100%', minHeight: SPACING.buttonMinHeight, borderRadius: 12, border: 'none',
            background: COLORS.teal, color: 'white', fontSize: 15, fontWeight: 700,
            cursor: canCreate ? 'pointer' : 'default', opacity: canCreate ? 1 : 0.5,
            fontFamily: 'inherit',
          }}
        >
          Create
        </button>
      </div>
    </div>
  )
}

function ThreadCard({ thread, isGeneral, messages, onOpen, onLongPressGeneral, onDeleteThread }) {
  const cardRef = useRef(null)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const last = messages[messages.length - 1]

  const longPress = useLongPress(() => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    if (isGeneral) {
      onLongPressGeneral()
    } else {
      setMenuAnchor({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
    }
  })

  return (
    <div style={{ position: 'relative' }}>
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
              <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.charcoal }}>{thread.title}</span>
              <span style={{ fontSize: 12, color: COLORS.warmGrey, flexShrink: 0 }}>
                {messages.length} {messages.length === 1 ? 'reply' : 'replies'}
              </span>
            </div>
            {isGeneral && (
              <p style={{ fontSize: 12, color: COLORS.warmGrey, fontStyle: 'italic', marginTop: 2, marginBottom: 8 }}>
                {thread.subtext}
              </p>
            )}
            <p style={{
              fontSize: 13, color: COLORS.warmGrey, fontStyle: last ? 'normal' : 'italic', marginTop: isGeneral ? 0 : 6,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {last ? `${last.name}: ${last.text}` : 'No messages yet'}
            </p>
          </div>
        </div>
      </button>

      {menuAnchor && (
        <ActionMenu
          anchorRect={menuAnchor}
          rows={[{ icon: <TrashIcon />, label: 'Delete discussion', color: COLORS.danger, onClick: () => { setMenuAnchor(null); onDeleteThread() } }]}
          onClose={() => setMenuAnchor(null)}
        />
      )}
    </div>
  )
}

export function DiscussScreen({ navigate, currentTrip, discussMessages, customThreads, addDiscussThread, deleteDiscussThread, openModal, closeModal }) {
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

  const threads = [DEFAULT_THREAD, ...(customThreads[currentTrip.id] || [])]

  const getMessages = (threadId) => {
    const simulated = buildSimulatedThreadMessages(threadId, tripMembers)
    const sent = (discussMessages && discussMessages[`${currentTrip.id}-${threadId}`]) || []
    return [...simulated, ...sent]
  }

  const showToast = (text) => {
    setToast(text)
    setTimeout(() => setToast(''), 2200)
  }

  const handleCreateThread = (title) => {
    addDiscussThread(currentTrip.id, title)
    closeModal()
  }

  const openNewThreadSheet = () => {
    openModal(
      <NewThreadSheet onCreate={handleCreateThread} onClose={closeModal} />
    )
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
            const isGeneral = thread.id === GENERAL_THREAD_ID
            return (
              <ThreadCard
                key={thread.id}
                thread={thread}
                isGeneral={isGeneral}
                messages={getMessages(thread.id)}
                onOpen={() => navigate('discussThread', { threadId: thread.id })}
                onLongPressGeneral={() => showToast('The General discussion cannot be deleted.')}
                onDeleteThread={() => deleteDiscussThread(currentTrip.id, thread.id)}
              />
            )
          })}

          <button
            onClick={openNewThreadSheet}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              background: COLORS.cardBg, borderRadius: 14, padding: '16px',
              boxShadow: SHADOW_CARD, border: `1.5px dashed ${COLORS.teal}`,
              fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 400, color: COLORS.teal, lineHeight: 1 }}>+</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.teal }}>Start a new discussion</span>
          </button>
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
