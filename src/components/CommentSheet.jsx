import { useState, useRef, useEffect } from 'react'
import { COLORS } from '../styles'

const COMMENT_TEMPLATES = [
  { text: 'This looks incredible, definitely adding this to our must-do list', timestamp: '2 hours ago' },
  { text: 'Agreed! Should we try to book this in advance or just show up?',    timestamp: '1 hour ago' },
  { text: 'I checked and it opens at 9am, perfect for our first morning',      timestamp: '45 minutes ago' },
]

export function buildSimulatedComments(tripMembers, userName) {
  const others = tripMembers.filter(m => m.name !== userName).slice(0, 3)
  return others.map((m, i) => ({
    id: `sim-${m.id}`, name: m.name, color: m.color, initial: m.initial,
    text: COMMENT_TEMPLATES[i].text, timestamp: COMMENT_TEMPLATES[i].timestamp,
  }))
}

export function CommentSheet({ initialComments, meMember, onAdd, onClose, item, starred, onToggleStar }) {
  const [comments, setComments] = useState(initialComments)
  const [text, setText]         = useState('')
  const listRef                 = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [comments.length])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    const newComment = {
      id: `c-${Date.now()}`, name: meMember.name, color: meMember.color, initial: meMember.initial,
      text: trimmed, timestamp: 'Just now',
    }
    setComments(prev => [...prev, newComment])
    onAdd(newComment)
    setText('')
  }

  const canSend = text.trim().length > 0

  return (
    <div
      style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="comment-sheet-slide" style={{
        background: 'white', borderRadius: '20px 20px 0 0', width: '100%', height: '65%',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Drag handle */}
        <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#D4C9BE' }} />
        </div>

        {/* Item context — group items have no separate detail screen, so this
            sheet is also where starring with attribution happens. */}
        {item && (
          <div style={{ padding: '0 20px 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <p style={{ flex: 1, fontSize: 15, fontWeight: 700, color: COLORS.charcoal, letterSpacing: -0.2 }}>
                {item.title}
              </p>
              <button
                onClick={onToggleStar}
                disabled={!onToggleStar}
                title={starred ? 'Remove your star' : 'Star this'}
                style={{
                  background: 'none', border: 'none', cursor: onToggleStar ? 'pointer' : 'default',
                  fontSize: 20, padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0,
                }}
              >
                {starred ? '⭐' : '☆'}
              </button>
            </div>
            {item.starredBy?.length > 0 && (
              <p style={{ fontSize: 12, color: '#B8860B', fontWeight: 600, marginTop: 4 }}>
                ⭐ Starred by {item.starredBy.join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Header */}
        <div style={{
          padding: '0 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0,
        }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.charcoal }}>Comments</span>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%',
              width: 30, height: 30, cursor: 'pointer', fontSize: 14, color: COLORS.warmGrey,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Comment list */}
        <div ref={listRef} className="screen-scroll" style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {comments.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: 14, color: COLORS.warmGrey, lineHeight: 1.5, fontWeight: 500 }}>
                No comments yet.<br />Be the first to say something.
              </p>
            </div>
          ) : comments.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: c.color, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: 'white',
              }}>
                {c.initial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.charcoal }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: COLORS.warmGrey }}>{c.timestamp}</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 400, color: COLORS.charcoal, lineHeight: 1.5 }}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div style={{
          padding: '12px 16px', borderTop: `1px solid ${COLORS.border}`, background: 'white',
          display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Add a comment"
            style={{
              flex: 1, minHeight: 40, borderRadius: 20,
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
              background: COLORS.teal, color: 'white',
              fontSize: 15, cursor: canSend ? 'pointer' : 'default', opacity: canSend ? 1 : 0.6,
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
