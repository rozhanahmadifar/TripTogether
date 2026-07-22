import { useState } from 'react'
import { timeAgo, PLATFORMS, isImagePhoto } from '../data'
import { COLORS, SHADOW_CARD, TEXT } from '../styles'
import { PencilIcon, TrashIcon } from './ActionMenu'

function DotsIcon({ size = 14, color = COLORS.charcoal }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  )
}

function Pill({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px', borderRadius: 20, fontFamily: 'inherit',
        border: `1.5px solid ${selected ? COLORS.teal : COLORS.border}`,
        background: selected ? COLORS.tealTint : 'white',
        color: selected ? COLORS.teal : COLORS.warmGrey,
        fontSize: 12, fontWeight: 600, cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function EditForm({ item, categories, allCategories, onCancel, onSave }) {
  const [title, setTitle]     = useState(item.title || '')
  const [link, setLink]       = useState(item.link || '')
  const [note, setNote]       = useState(item.note || '')
  const [source, setSource]   = useState(item.platform || '')
  const [categoryIds, setCategoryIds] = useState((categories || []).map(c => c.id))

  // A link, photo, or note already identifies the item at a glance, so
  // title only needs to be required when none of those exist either.
  const hasOtherContent = !!item.photo || link.trim().length > 0 || note.trim().length > 0
  const canSave = (title.trim().length > 0 || hasOtherContent) && categoryIds.length > 0

  const toggleCategory = (id) => {
    setCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  const handleSave = () => {
    if (!canSave) return
    onSave({ title: title.trim(), link: link.trim(), note: note.trim(), platform: source, categoryIds })
  }

  return (
    <div style={{ padding: 16 }}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder={hasOtherContent ? 'Title (optional)' : 'Title'}
        style={{
          width: '100%', minHeight: 40, borderRadius: 10,
          border: `1.5px solid ${COLORS.teal}`, padding: '0 12px',
          fontSize: 15, fontWeight: 600, color: COLORS.charcoal,
          background: COLORS.bg, fontFamily: 'inherit', marginBottom: 10, boxSizing: 'border-box',
        }}
      />
      <input
        value={link}
        onChange={e => setLink(e.target.value)}
        placeholder="Link (optional)"
        style={{
          width: '100%', minHeight: 40, borderRadius: 10,
          border: `1.5px solid ${COLORS.border}`, padding: '0 12px',
          fontSize: 13, color: COLORS.charcoal,
          background: COLORS.bg, fontFamily: 'inherit', marginBottom: 10, boxSizing: 'border-box',
        }}
      />
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Add a note…"
        rows={3}
        style={{
          width: '100%', borderRadius: 10, border: `1.5px solid ${COLORS.border}`,
          padding: '10px 12px', fontSize: 13, color: COLORS.charcoal,
          background: COLORS.bg, fontFamily: 'inherit', resize: 'none',
          lineHeight: 1.5, marginBottom: 12, boxSizing: 'border-box',
        }}
      />

      <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
        Source
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {PLATFORMS.map(p => (
          <Pill key={p} label={p} selected={source === p} onClick={() => setSource(p)} />
        ))}
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
        Tags — choose one or more
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {allCategories.map(c => (
          <Pill
            key={c.id}
            label={`${c.icon} ${c.label}`}
            selected={categoryIds.includes(c.id)}
            onClick={() => toggleCategory(c.id)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1, minHeight: 44, borderRadius: 10, border: 'none',
            background: COLORS.borderLight, color: COLORS.warmGrey,
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            flex: 1, minHeight: 44, borderRadius: 10, border: 'none',
            background: canSave ? COLORS.action : COLORS.border,
            color: canSave ? 'white' : '#A79E93',
            fontSize: 14, fontWeight: 600, cursor: canSave ? 'pointer' : 'default', fontFamily: 'inherit',
          }}
        >
          Save
        </button>
      </div>
    </div>
  )
}

// FIX 4 — consistent item card structure: coloured preview zone with source
// badge, contributor + title + description, then a heart/comment footer.
export function ItemCard({ item, categories, contributor, source, note, hearts = 0, hearted = false, onToggleHeart, onOpen, previewHeight = 100, isOwner = true, onDelete, onSave, allCategories = [], hideFooter = false, starred = false, starredBy = [], onToggleStar }) {
  const TopTag = onOpen ? 'button' : 'div'
  const primaryCategory = (categories && categories[0]) || { icon: '✨', color: COLORS.teal }
  const [pulsing, setPulsing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [fading, setFading] = useState(false)
  const [editing, setEditing] = useState(false)

  const handleHeart = () => {
    if (!onToggleHeart) return
    setPulsing(true)
    setTimeout(() => setPulsing(false), 220)
    onToggleHeart()
  }

  const closeMenu = () => setMenuOpen(false)

  const handleConfirmDelete = () => {
    setConfirming(false)
    setFading(true)
    setTimeout(() => onDelete && onDelete(), 200)
  }

  const handleEditSave = (updates) => {
    onSave && onSave(updates)
    setEditing(false)
  }

  const menuRows = isOwner
    ? [
        { icon: <PencilIcon />, label: 'Edit', color: COLORS.charcoal, onClick: () => { closeMenu(); setEditing(true) } },
        { icon: <TrashIcon />, label: 'Delete', color: COLORS.danger, onClick: () => { closeMenu(); setConfirming(true) } },
      ]
    : [
        { label: 'Report this item', color: COLORS.warmGrey, onClick: closeMenu },
      ]

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'relative',
          background: starred ? COLORS.tealTint : COLORS.cardBg, borderRadius: 14,
          border: `2px solid ${starred ? COLORS.teal : 'transparent'}`,
          boxShadow: SHADOW_CARD, overflow: 'hidden',
          opacity: fading ? 0 : 1, transition: 'opacity 200ms ease, background 150ms ease, border-color 150ms ease',
        }}
      >
        {editing ? (
          <EditForm
            item={item}
            categories={categories}
            allCategories={allCategories}
            onCancel={() => setEditing(false)}
            onSave={handleEditSave}
          />
        ) : (
          <TopTag
            onClick={onOpen}
            style={{
              display: 'block', width: '100%', border: 'none', padding: 0, margin: 0,
              background: 'none', textAlign: 'left', cursor: onOpen ? 'pointer' : 'default',
              fontFamily: 'inherit',
            }}
          >
            {/* Top zone — real photo when the item has one, coloured preview otherwise */}
            <div style={{
              height: previewHeight,
              background: isImagePhoto(item.photo) ? '#EFE8DE' : `${primaryCategory.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {isImagePhoto(item.photo) ? (
                <img src={item.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : item.photo ? (
                <span style={{ fontSize: 38 }}>🎬</span>
              ) : (
                <span style={{ fontSize: 38 }}>{primaryCategory.icon}</span>
              )}
              {source && (
                <span style={{
                  position: 'absolute', top: 10, left: 10,
                  background: 'white', color: COLORS.charcoal,
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.2,
                  borderRadius: 20, padding: '4px 10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.14)',
                }}>
                  {source}
                </span>
              )}
              {starredBy.length > 0 && (
                <span
                  title={`Marked as decided by ${starredBy.join(', ')}`}
                  style={{
                    position: 'absolute', bottom: 10, right: 10,
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: COLORS.teal, color: 'white',
                    fontSize: 11, fontWeight: 800, letterSpacing: 0.2,
                    borderRadius: 20, padding: '5px 10px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                  }}
                >
                  ✓ Decided
                </span>
              )}
            </div>

            {/* Middle zone */}
            <div style={{ padding: 16, paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  {contributor && (
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', background: contributor.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>
                      {contributor.initial}
                    </div>
                  )}
                  {contributor && (
                    <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.charcoal, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {contributor.name}
                    </span>
                  )}
                </div>
                <span style={{ ...TEXT.timestamp, flexShrink: 0 }}>{timeAgo(item.savedAt)}</span>
              </div>

              {item.title && (
                <p style={TEXT.cardTitle}>
                  {item.title}
                </p>
              )}

              {note && (
                <p style={{
                  ...TEXT.body, color: COLORS.warmGrey, marginTop: 6,
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {note}
                </p>
              )}

              {(item.link || (categories && categories.length > 0)) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  {item.link && (
                    <span
                      title="Has a link"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 22, height: 22, borderRadius: '50%', background: COLORS.tealTint,
                        fontSize: 11, flexShrink: 0,
                      }}
                    >
                      🔗
                    </span>
                  )}
                  {(categories || []).map(c => (
                    <span key={c.id} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: `${c.color}1F`, color: COLORS.charcoal,
                      fontSize: 11, fontWeight: 600, borderRadius: 20, padding: '3px 9px',
                    }}>
                      {c.icon} {c.label}
                    </span>
                  ))}
                </div>
              )}

              {starredBy.length > 0 && (
                <p style={{ fontSize: 12, color: COLORS.teal, fontWeight: 600, marginTop: 8 }}>
                  ✓ Marked as decided by {starredBy.join(', ')}
                </p>
              )}
            </div>
          </TopTag>
        )}

        {/* Three-dot menu button — sibling of TopTag (not nested inside it) so it
            never ends up inside a <button>, and overlays the top-right corner. */}
        {!editing && (
          <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o) }}
              aria-label="More options"
              style={{
                width: 28, height: 28, borderRadius: '50%', border: 'none',
                background: 'rgba(255,255,255,0.9)', boxShadow: '0 2px 6px rgba(0,0,0,0.14)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <DotsIcon />
            </button>

            {menuOpen && (
              <>
                <div onClick={closeMenu} style={{ position: 'fixed', inset: 0, zIndex: 1 }} />
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 6,
                  background: 'white', borderRadius: 10,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  overflow: 'hidden', zIndex: 2, minWidth: 160,
                }}>
                  {menuRows.map((row, i) => (
                    <button
                      key={i}
                      onClick={row.onClick}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 16px', background: 'none', border: 'none',
                        borderTop: i > 0 ? `1px solid ${COLORS.borderLight}` : 'none',
                        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                      }}
                    >
                      {row.icon}
                      <span style={{ fontSize: 14, fontWeight: 600, color: row.color }}>{row.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Bottom zone — one fixed row, heart pinned left and the decided
            checkbox pinned right (space-between, not both bunched to one
            side), so the two actions sit at a consistent, predictable spot
            every time regardless of how much text either one has. */}
        {!editing && !hideFooter && (
          <div style={{
            borderTop: `1px solid ${COLORS.borderLight}`,
            padding: '6px 14px', minHeight: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <button
              onClick={handleHeart}
              disabled={!onToggleHeart}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none',
                cursor: onToggleHeart ? 'pointer' : 'default',
                padding: '8px 4px', borderRadius: 8,
              }}
            >
              <span className={pulsing ? 'heart-pulse' : ''} style={{ fontSize: 20, lineHeight: 1 }}>{hearted ? '❤️' : '🤍'}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: hearted ? COLORS.terracotta : COLORS.warmGrey }}>{hearts}</span>
            </button>

            {/* Decided — a real checkbox toggle (empty outline vs. filled
                tick), not just a swapped icon or label, so the state reads
                at a glance the way a checkbox always does. */}
            <button
              onClick={onToggleStar}
              disabled={!onToggleStar}
              title={starred ? 'Unmark as decided' : 'Mark as decided'}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: 'none',
                cursor: onToggleStar ? 'pointer' : 'default',
                padding: '8px 4px', borderRadius: 8,
              }}
            >
              <span style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0, lineHeight: 1,
                border: `2px solid ${starred ? COLORS.teal : '#C9BFB2'}`,
                background: starred ? COLORS.teal : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {starred && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 12 9 17 20 6" />
                  </svg>
                )}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: starred ? COLORS.teal : COLORS.warmGrey }}>
                Decided{starredBy.length > 0 ? ` (${starredBy.length})` : ''}
              </span>
            </button>
          </div>
        )}
      </div>

      {confirming && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
          }}
          onClick={e => { if (e.target === e.currentTarget) setConfirming(false) }}
        >
          <div style={{
            background: 'white', borderRadius: 16, padding: 20, width: '100%', maxWidth: 280,
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)', textAlign: 'center',
          }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal, marginBottom: 18, lineHeight: 1.4 }}>
              Are you sure you want to delete this item?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirming(false)}
                style={{
                  flex: 1, minHeight: 40, borderRadius: 10, border: 'none',
                  background: COLORS.borderLight, color: COLORS.warmGrey,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  flex: 1, minHeight: 40, borderRadius: 10, border: 'none',
                  background: COLORS.danger, color: 'white',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
