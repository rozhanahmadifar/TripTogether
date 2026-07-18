import { useState, useRef, useEffect } from 'react'
import { ItemCard } from '../components/ItemCard'
import { GridTile } from '../components/GridTile'
import { ViewToggle } from '../components/ViewToggle'
import { EmptyState } from '../components/EmptyState'
import { BackButton } from '../components/BackButton'
import { COLORS, SPACING } from '../styles'

const COMMENT_TEMPLATES = [
  { text: 'This looks incredible, definitely adding this to our must-do list', timestamp: '2 hours ago' },
  { text: 'Agreed! Should we try to book this in advance or just show up?',    timestamp: '1 hour ago' },
  { text: 'I checked and it opens at 9am, perfect for our first morning',      timestamp: '45 minutes ago' },
]

function buildSimulatedComments(tripMembers, userName) {
  const others = tripMembers.filter(m => m.name !== userName).slice(0, 3)
  return others.map((m, i) => ({
    id: `sim-${m.id}`, name: m.name, color: m.color, initial: m.initial,
    text: COMMENT_TEMPLATES[i].text, timestamp: COMMENT_TEMPLATES[i].timestamp,
  }))
}

function CommentSheet({ initialComments, meMember, onAdd, onClose }) {
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

export function GroupCategoryScreen({ navigate, params = {}, currentTrip, groupItems, addToGroup, toggleHeart, deleteGroupItem, updateGroupItem, userName, allCategories, openModal, closeModal }) {
  const { categoryId } = params
  const cat = allCategories.find(c => c.id === categoryId) || allCategories[0] || { id: '', icon: '✨', label: 'Ideas', color: '#1E5F5F' }
  const items = groupItems.filter(i => i.categoryIds.includes(cat.id))
  const tripMembers = currentTrip?.members || []

  const contributorNames = [...new Set(items.map(i => i.savedBy))]

  const getMember = (name) => {
    const found = tripMembers.find(m => m.name === name)
    if (found) return found
    if (name === userName) return { name, color: COLORS.terracotta, initial: name.charAt(0).toUpperCase() }
    return { name, color: '#B5AA9C', initial: name.charAt(0).toUpperCase() }
  }

  const nonContributors = tripMembers.filter(m => !contributorNames.includes(m.name))

  const [commentsByItem, setCommentsByItem] = useState({})
  const [view, setView] = useState('list')

  const openComments = (item) => {
    const me = getMember(userName)
    const simulated = buildSimulatedComments(tripMembers, userName)
    openModal(
      <CommentSheet
        initialComments={commentsByItem[item.id] || simulated}
        meMember={me}
        onAdd={(c) => setCommentsByItem(prev => ({ ...prev, [item.id]: [...(prev[item.id] || simulated), c] }))}
        onClose={closeModal}
      />
    )
  }

  return (
    <div className="screen" style={{ background: COLORS.bgGroupSpace }}>
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
        <BackButton onClick={() => navigate(params.backTo || 'groupSpace')} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 19, fontWeight: 800, color: COLORS.teal, letterSpacing: -0.4 }}>
            {cat.icon} {cat.label}
          </p>
          <p style={{ fontSize: 12, color: COLORS.warmGrey, marginTop: 2 }}>Group Space</p>
        </div>
        {items.length > 0 && <ViewToggle view={view} setView={setView} />}
      </div>

      <div className="screen-scroll" style={{ padding: `16px ${SPACING.screenX}px ${SPACING.scrollBottomPad}px` }}>
        {/* Contributors card — celebratory, not an audit */}
        <div style={{
          background: 'white', borderRadius: 14, padding: SPACING.cardPad, marginBottom: SPACING.sectionGap,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.teal, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>
            Who has contributed
          </p>
          {tripMembers.length === 0 ? (
            <p style={{ fontSize: 12, color: COLORS.warmGrey, fontStyle: 'italic', fontWeight: 500 }}>No group members yet.</p>
          ) : (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {tripMembers.map(m => {
                const contributed = contributorNames.includes(m.name)
                return (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: contributed ? m.color : 'transparent',
                      border: contributed ? 'none' : '2px dashed #D6CCBF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: contributed ? 'white' : '#B5AA9C',
                      boxShadow: contributed ? `0 0 0 3px ${m.color}40` : 'none',
                    }}>
                      {m.initial}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: contributed ? COLORS.charcoal : COLORS.warmGrey }}>
                      {m.name}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
          {nonContributors.length > 0 && (
            <p style={{ fontSize: 12, color: COLORS.warmGrey, marginTop: 14, fontStyle: 'italic', fontWeight: 500 }}>
              Waiting for {nonContributors.map(m => m.name).join(' & ')} to add something
            </p>
          )}
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <EmptyState
            categoryId={cat.id}
            heading={`Nothing in ${cat.label} yet`}
            actionLabel="Add the first item"
            onAction={() => navigate('saveSomething', { categoryId: cat.id, mode: 'group', backTo: 'groupCategory', returnParams: { categoryId: cat.id } })}
          />
        ) : view === 'grid' ? (
          <div style={{ columnCount: 2, columnGap: 14 }}>
            {items.map(item => (
              <GridTile
                key={item.id}
                item={item}
                category={cat}
                onOpen={() => openComments(item)}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.cardGap }}>
            {items.map(item => {
              const saver = getMember(item.savedBy)
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  categories={item.categoryIds.map(id => allCategories.find(c => c.id === id)).filter(Boolean)}
                  contributor={saver}
                  source={item.platform}
                  note={item.note}
                  hearts={item.hearts}
                  hearted={item.hearted}
                  previewHeight={110}
                  allCategories={allCategories}
                  onToggleHeart={() => toggleHeart(item.id)}
                  onCommentClick={() => openComments(item)}
                  isOwner={item.savedBy === userName}
                  onDelete={() => deleteGroupItem(item.id)}
                  onSave={(updates) => updateGroupItem(item.id, updates)}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
