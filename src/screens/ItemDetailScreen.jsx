import { useState } from 'react'
import { PLATFORM_COLORS, CATEGORY_HINTS, timeAgo, truncateName, isImagePhoto, displayTitle } from '../data'
import { TEXT, COLORS, SPACING } from '../styles'
import { BackButton } from '../components/BackButton'

export function ItemDetailScreen({ navigate, params = {}, myIdeas, currentTrip, addToGroup, updateMyIdea, allCategories }) {
  const [showPicker, setShowPicker]           = useState(false)
  const [pickedCategories, setPickedCategories] = useState([])
  const [editing, setEditing]         = useState(false)
  const [editTitle, setEditTitle]     = useState('')
  const [editLink, setEditLink]       = useState('')
  const [editNote, setEditNote]       = useState('')
  const [editCategoryIds, setEditCategoryIds] = useState([])

  const { itemId, categoryId, backTo = 'myIdeasCategory' } = params
  const item = myIdeas.find(i => i.id === itemId)
  const cat  = allCategories.find(c => c.id === categoryId) || allCategories[0] || { id: '', icon: '✨', label: 'Ideas', color: COLORS.teal }
  const itemCategories = item ? item.categoryIds.map(id => allCategories.find(c => c.id === id)).filter(Boolean) : []

  const handleBack = () => navigate(backTo, { categoryId, backTo: params.parentBackTo, tripScoped: params.tripScoped })

  const togglePicked = (id) => {
    setPickedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  const handleConfirmShare = () => {
    if (pickedCategories.length === 0) return
    addToGroup({ title: item.title, note: item.note, link: item.link, platform: item.platform, categoryIds: pickedCategories, hasPhoto: item.hasPhoto, photo: item.photo, tripId: currentTrip?.id })
    navigate('shareSuccess', { categoryIds: pickedCategories })
  }

  const startEdit = () => {
    setEditTitle(item.title || '')
    setEditLink(item.link || '')
    setEditNote(item.note || '')
    setEditCategoryIds(item.categoryIds || [])
    setEditing(true)
  }

  const toggleEditCategory = (id) => {
    setEditCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  // A link, photo, or note already identifies the item at a glance, so
  // title only needs to be required when none of those exist either.
  const editHasOtherContent = !!item.photo || editLink.trim().length > 0 || editNote.trim().length > 0
  const canSaveEdit = (editTitle.trim().length > 0 || editHasOtherContent) && editCategoryIds.length > 0

  const saveEdit = () => {
    if (!canSaveEdit) return
    updateMyIdea(item.id, {
      title: editTitle.trim(), link: editLink.trim(), note: editNote.trim(), categoryIds: editCategoryIds,
    })
    setEditing(false)
  }

  if (!item) {
    return (
      <div className="screen" style={{ background: 'white' }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackButton onClick={handleBack} />
        </div>
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <p style={{ color: COLORS.warmGrey }}>Item not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="screen" style={{ background: 'white' }}>
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${COLORS.border}` }}>
        <BackButton onClick={handleBack} />
        <p style={{ flex: 1, fontSize: 19, fontWeight: 800, color: COLORS.teal, letterSpacing: -0.4 }}>
          {cat.icon} {cat.label}
        </p>
        {!editing && (
          <button
            onClick={startEdit}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: COLORS.teal, padding: '4px 0' }}
          >
            Edit
          </button>
        )}
      </div>

      <div className="screen-scroll" style={{ padding: `20px ${SPACING.screenX}px 40px` }}>

        {editing ? (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>
              Title {editHasOtherContent && <span style={{ textTransform: 'none', fontWeight: 500, color: COLORS.warmGrey }}>Optional</span>}
            </p>
            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              style={{
                width: '100%', minHeight: 44, borderRadius: 10, border: `1.5px solid ${COLORS.teal}`,
                padding: '0 12px', fontSize: 15, fontWeight: 600, color: COLORS.charcoal,
                background: COLORS.bg, fontFamily: 'inherit', marginBottom: 14, boxSizing: 'border-box',
              }}
            />

            <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Link</p>
            <input
              value={editLink}
              onChange={e => setEditLink(e.target.value)}
              placeholder="Paste a URL…"
              style={{
                width: '100%', minHeight: 44, borderRadius: 10, border: `1.5px solid ${COLORS.border}`,
                padding: '0 12px', fontSize: 14, color: COLORS.charcoal,
                background: COLORS.bg, fontFamily: 'inherit', marginBottom: 14, boxSizing: 'border-box',
              }}
            />

            <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Note</p>
            <textarea
              value={editNote}
              onChange={e => setEditNote(e.target.value)}
              rows={3}
              style={{
                width: '100%', borderRadius: 10, border: `1.5px solid ${COLORS.border}`,
                padding: '10px 12px', fontSize: 14, color: COLORS.charcoal,
                background: COLORS.bg, fontFamily: 'inherit', resize: 'none', lineHeight: 1.5,
                marginBottom: 14, boxSizing: 'border-box',
              }}
            />

            <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Tags — choose one or more</p>
            <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 20, border: `1px solid ${COLORS.border}` }}>
              {allCategories.map((c, i) => {
                const selected = editCategoryIds.includes(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleEditCategory(c.id)}
                    style={{
                      width: '100%', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '13px 16px', textAlign: 'left',
                      background: selected ? `${COLORS.terracotta}12` : 'white',
                      borderBottom: i < allCategories.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none',
                      borderLeft: selected ? `3px solid ${COLORS.terracotta}` : '3px solid transparent',
                    }}
                  >
                    <span style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      border: `2px solid ${selected ? COLORS.terracotta : COLORS.border}`,
                      background: selected ? COLORS.terracotta : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, color: 'white', fontWeight: 800,
                    }}>
                      {selected ? '✓' : ''}
                    </span>
                    <span style={{ fontSize: 18, width: 24, flexShrink: 0 }}>{c.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 14, fontWeight: selected ? 700 : 500, display: 'block', color: selected ? COLORS.terracotta : COLORS.charcoal }}>
                        {c.label}
                      </span>
                      {CATEGORY_HINTS[c.id] && (
                        <span style={{ fontSize: 12, color: COLORS.warmGrey, display: 'block', marginTop: 1 }}>
                          {CATEGORY_HINTS[c.id]}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setEditing(false)}
                style={{
                  flex: 1, minHeight: 48, borderRadius: 12, border: 'none',
                  background: COLORS.borderLight, color: COLORS.warmGrey,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={!canSaveEdit}
                style={{
                  flex: 1, minHeight: 48, borderRadius: 12, border: 'none',
                  background: canSaveEdit ? COLORS.action : COLORS.border,
                  color: canSaveEdit ? 'white' : COLORS.warmGrey,
                  fontSize: 14, fontWeight: 600, cursor: canSaveEdit ? 'pointer' : 'default', fontFamily: 'inherit',
                }}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {itemCategories.map(c => (
                <span key={c.id} style={{
                  background: `${c.color}22`, color: COLORS.charcoal,
                  fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '5px 12px',
                }}>
                  {c.icon} {c.label}
                </span>
              ))}
              {item.platform && (
                <span style={{
                  background: PLATFORM_COLORS[item.platform] || COLORS.warmGrey,
                  color: 'white', fontSize: 12, fontWeight: 700,
                  borderRadius: 8, padding: '5px 12px',
                }}>
                  {item.platform}
                </span>
              )}
            </div>

            {/* Photo/video */}
            {isImagePhoto(item.photo) ? (
              <img
                src={item.photo}
                alt=""
                style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 14, marginBottom: 16 }}
              />
            ) : item.photo ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, background: COLORS.sand,
                borderRadius: 12, padding: '12px 14px', marginBottom: 16,
              }}>
                <span style={{ fontSize: 20 }}>🎬</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.charcoal }}>{item.photo}</span>
              </div>
            ) : null}

            {/* Title stays optional — when blank, this falls back to a
                readable label (source name, or a generic "Saved link" /
                "Saved item") rather than showing nothing or a raw URL. */}
            <p style={{
              fontSize: 18, fontWeight: 700, color: COLORS.charcoal, lineHeight: 1.45,
              letterSpacing: -0.3, marginBottom: 8,
            }}>
              {displayTitle(item)}
            </p>

            {item.note && (
              <p style={{ ...TEXT.body, color: COLORS.warmGrey, marginBottom: 12, lineHeight: 1.55 }}>
                {item.note}
              </p>
            )}

            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 13, fontWeight: 600, color: COLORS.teal,
                  marginBottom: 12, wordBreak: 'break-all', textDecoration: 'none',
                }}
              >
                🔗 <span style={{ textDecoration: 'underline' }}>{item.link}</span>
              </a>
            )}

            <p style={{ ...TEXT.timestamp, marginBottom: 24 }}>
              Saved {timeAgo(item.savedAt)}
            </p>

            {/* Saved Privately card */}
            <div style={{
              background: COLORS.sand, borderRadius: 14, padding: '16px',
              marginBottom: 28,
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>
                🔒 Saved Privately
              </p>
              <p style={{ fontSize: 14, color: COLORS.charcoal, lineHeight: 1.55, fontWeight: 500 }}>
                Only you can see this. You can share it with your group whenever you're ready.
              </p>
            </div>

            {/* Add to Group Space */}
            {!showPicker ? (
              <button
                onClick={() => setShowPicker(true)}
                style={{
                  width: '100%', height: 52, borderRadius: 14, border: 'none',
                  background: COLORS.action, color: 'white',
                  fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  letterSpacing: -0.2, marginBottom: 12,
                }}
              >
                Add to Group Space
              </button>
            ) : (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.charcoal, marginBottom: 4, letterSpacing: -0.2 }}>
                  Which categories in Group Space?
                </p>
                <p style={{ fontSize: 12, color: COLORS.warmGrey, marginBottom: 12 }}>
                  Choose one or more
                </p>
                <div style={{
                  borderRadius: 14, overflow: 'hidden', marginBottom: 14,
                  border: `1px solid ${COLORS.border}`,
                }}>
                  {allCategories.map((c, i) => {
                    const selected = pickedCategories.includes(c.id)
                    return (
                      <button
                        key={c.id}
                        onClick={() => togglePicked(c.id)}
                        style={{
                          width: '100%', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '13px 16px', textAlign: 'left',
                          background: selected ? `${COLORS.terracotta}12` : 'white',
                          borderBottom: i < allCategories.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none',
                          borderLeft: selected ? `3px solid ${COLORS.terracotta}` : '3px solid transparent',
                        }}
                      >
                        <span style={{
                          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                          border: `2px solid ${selected ? COLORS.terracotta : COLORS.border}`,
                          background: selected ? COLORS.terracotta : 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, color: 'white', fontWeight: 800,
                        }}>
                          {selected ? '✓' : ''}
                        </span>
                        <span style={{ fontSize: 18, width: 24, flexShrink: 0 }}>{c.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{
                            fontSize: 14, fontWeight: selected ? 700 : 500, display: 'block',
                            color: selected ? COLORS.terracotta : COLORS.charcoal,
                          }}>
                            {c.label}
                          </span>
                          {CATEGORY_HINTS[c.id] && (
                            <span style={{ fontSize: 12, color: COLORS.warmGrey, display: 'block', marginTop: 1 }}>
                              {CATEGORY_HINTS[c.id]}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={handleConfirmShare}
                  disabled={pickedCategories.length === 0}
                  style={{
                    width: '100%', height: 52, borderRadius: 14, border: 'none',
                    background: pickedCategories.length > 0 ? COLORS.action : COLORS.border,
                    color: pickedCategories.length > 0 ? 'white' : COLORS.warmGrey,
                    fontSize: 15, fontWeight: 600,
                    cursor: pickedCategories.length > 0 ? 'pointer' : 'default',
                    letterSpacing: -0.2,
                  }}
                >
                  Confirm
                </button>
              </div>
            )}

            <button
              onClick={handleBack}
              style={{
                width: '100%', height: 48, background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 14, color: COLORS.warmGrey, fontWeight: 500,
              }}
            >
              Keep private for now
            </button>

            {currentTrip && currentTrip.members && currentTrip.members.length > 0 && (
              <div style={{ marginTop: 28, borderTop: `1px solid ${COLORS.border}`, paddingTop: 20 }}>
                <p style={{ fontSize: 12, color: COLORS.warmGrey, marginBottom: 14, fontWeight: 500 }}>
                  Your group · {currentTrip.name}
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {currentTrip.members.map(m => (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: m.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: 'white',
                      }}>
                        {m.initial}
                      </div>
                      <span style={{ fontSize: 10, color: COLORS.warmGrey, fontWeight: 600 }} title={m.name}>{truncateName(m.name)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
