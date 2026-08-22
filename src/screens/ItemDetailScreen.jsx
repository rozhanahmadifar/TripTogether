import { useState } from 'react'
import { PLATFORM_COLORS, CATEGORY_HINTS, timeAgo, isImagePhoto, displayTitle } from '../data'
import { TEXT, COLORS, SPACING } from '../styles'
import { BackButton } from '../components/BackButton'
import { CategoryIcon } from '../components/CategoryIcons'

export function ItemDetailScreen({ navigate, params = {}, myIdeas, trips, addToGroup, updateMyIdea, allCategories }) {
  // A share flow with three possible stages: 'trip' (only shown when more
  // than one trip exists and none has been picked yet), 'categories', or
  // closed. With zero or exactly one trip, there's never a real choice to
  // make, so the flow skips straight to categories.
  const [shareStep, setShareStep]     = useState('closed')
  const [targetTripId, setTargetTripId] = useState(null)
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

  // Sharing is available everywhere an item can be opened — home or inside
  // a trip — and adapts to how many trips actually exist rather than to how
  // this screen happened to be reached:
  //   0 trips  → nothing to share into, no share action at all
  //   1 trip   → "Share with <name>" directly, no picker needed
  //   2+ trips → "Share with Group" opens a trip picker first
  const allTrips = trips || []
  const onlyTrip = allTrips.length === 1 ? allTrips[0] : null
  const targetTrip = onlyTrip || allTrips.find(t => t.id === targetTripId) || null
  // An item can only ever be shared to one trip at a time — sharing again
  // elsewhere simply moves which trip it's tagged as shared to, rather than
  // tracking a list.
  const sharedTrip = allTrips.find(t => t.id === item?.sharedTripId)
  const alreadySharedWithTarget = !!(targetTrip && item?.sharedTripId === targetTrip.id)

  const handleBack = () => navigate(backTo, { categoryId, backTo: params.parentBackTo })

  const togglePicked = (id) => {
    setPickedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  const startShare = () => {
    if (onlyTrip) {
      setTargetTripId(onlyTrip.id)
      setShareStep('categories')
    } else {
      setShareStep('trip')
    }
  }

  const pickTrip = (trip) => {
    setTargetTripId(trip.id)
    setShareStep('categories')
  }

  const cancelShare = () => {
    setShareStep('closed')
    setPickedCategories([])
  }

  const handleConfirmShare = () => {
    if (pickedCategories.length === 0 || !targetTrip || alreadySharedWithTarget) return
    addToGroup({ title: item.title, note: item.note, link: item.link, platform: item.platform, categoryIds: pickedCategories, hasPhoto: item.hasPhoto, photo: item.photo, tripId: targetTrip.id })
    updateMyIdea(item.id, { sharedTripId: targetTrip.id })
    // `tripId` is passed explicitly rather than left for ShareSuccessScreen
    // to infer from "the currently open trip" — this flow never calls
    // openTrip, so if the user's active trip differs from the one they just
    // shared into (e.g. they picked a different trip in the share-target
    // list), the success screen would otherwise show the wrong trip's name
    // and its "Go to Group Space" button would open the wrong trip, making
    // the just-shared item look like it never arrived.
    navigate('shareSuccess', { categoryIds: pickedCategories, tripId: targetTrip.id })
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
        <p style={{ flex: 1, fontSize: 19, fontWeight: 800, color: COLORS.teal, letterSpacing: -0.4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CategoryIcon id={cat.id} size={20} color={cat.shade || COLORS.teal} /> {cat.label}
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
                    <span style={{ width: 24, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                      <CategoryIcon id={c.id} size={17} color={selected ? COLORS.terracotta : (c.shade || COLORS.charcoal)} />
                    </span>
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
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <CategoryIcon id={c.id} size={13} color={c.shade || COLORS.charcoal} /> {c.label}
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

              {/* Sharing copies, it never moves — the item stays here in My
                  Ideas and also appears in that trip's Group Space, so this
                  badge is the only way to tell, from the private copy, that
                  it's already out there. */}
              {sharedTrip && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.teal }}>
                    🔗 Shared with {sharedTrip.name}
                  </span>
                </div>
              )}
            </div>

            {/* Share — adapts to how many trips exist rather than to how
                this screen was reached, so the exact same idea can be
                shared whether opened from home or from inside a trip (see
                allTrips/onlyTrip/targetTrip above). Once already shared to
                the resolved target, the single primary action is replaced
                with a plain status line so the same idea can't be copied
                into that trip's Group Space twice. The trip/category
                picker itself lives in a bottom-sheet (below), not inline
                here, so this is the only sharing action ever visible on
                the page itself. */}
            {allTrips.length > 0 && (
              alreadySharedWithTarget ? (
                <div style={{
                  width: '100%', minHeight: 52, borderRadius: 14,
                  background: COLORS.tealTint, color: COLORS.teal,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, letterSpacing: -0.2,
                  marginBottom: 12, padding: '10px 16px', textAlign: 'center',
                }}>
                  ✓ Already shared with {targetTrip.name}
                </div>
              ) : (
                <button
                  onClick={startShare}
                  style={{
                    width: '100%', height: 52, borderRadius: 14, border: 'none',
                    background: COLORS.action, color: 'white',
                    fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    letterSpacing: -0.2, marginBottom: 12,
                  }}
                >
                  {onlyTrip ? `Share with ${onlyTrip.name}` : 'Share with Group'}
                </button>
              )
            )}
          </>
        )}
      </div>

      {/* Share bottom-sheet — the trip picker (only when more than one
          trip exists) and the category picker both live here instead of
          expanding inline on the page, so the page itself only ever shows
          the one "Share with…" action. Tapping the backdrop cancels, same
          as Confirm/Cancel below, and never shares anything. */}
      {shareStep !== 'closed' && (
        <div
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}
          onClick={e => { if (e.target === e.currentTarget) cancelShare() }}
        >
          <div style={{ background: 'white', borderRadius: '20px 20px 0 0', padding: '24px 20px 28px', width: '100%', maxHeight: '80vh', overflowY: 'auto', boxSizing: 'border-box' }}>
            {shareStep === 'trip' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ flex: 1, fontSize: 20, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.5 }}>Which trip is this for?</h3>
                  <button
                    onClick={cancelShare}
                    style={{ background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
                  {allTrips.map((t, i) => {
                    const alreadyShared = item.sharedTripId === t.id
                    return (
                      <button
                        key={t.id}
                        onClick={() => !alreadyShared && pickTrip(t)}
                        disabled={alreadyShared}
                        style={{
                          width: '100%', border: 'none', cursor: alreadyShared ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '13px 16px', textAlign: 'left',
                          background: alreadyShared ? COLORS.bg : 'white',
                          borderBottom: i < allTrips.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, display: 'block', color: alreadyShared ? COLORS.warmGrey : COLORS.charcoal }}>
                            {t.name}
                          </span>
                          {t.destination && (
                            <span style={{ fontSize: 12, color: COLORS.warmGrey, display: 'block', marginTop: 1 }}>
                              📍 {t.destination}
                            </span>
                          )}
                        </div>
                        {alreadyShared ? (
                          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.teal, flexShrink: 0 }}>✓ Already shared</span>
                        ) : (
                          <div style={{ display: 'flex', flexShrink: 0 }}>
                            {(t.members || []).slice(0, 3).map((m, idx) => (
                              <div key={m.id} style={{
                                width: 24, height: 24, borderRadius: '50%', background: m.color,
                                border: '2px solid white', marginLeft: idx > 0 ? -8 : 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 10, fontWeight: 700, color: 'white', lineHeight: 1,
                              }}>
                                {m.initial}
                              </div>
                            ))}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.5, marginBottom: 4 }}>
                  Which categories in Group Space?
                </h3>
                <p style={{ fontSize: 12, color: COLORS.warmGrey, marginBottom: 16 }}>
                  Choose one or more{!onlyTrip && targetTrip ? ` · ${targetTrip.name}` : ''}
                </p>
                <div style={{
                  borderRadius: 14, overflow: 'hidden', marginBottom: 20,
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
                        <span style={{ width: 24, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                          <CategoryIcon id={c.id} size={17} color={selected ? COLORS.terracotta : (c.shade || COLORS.charcoal)} />
                        </span>
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
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={cancelShare}
                    style={{
                      flex: 1, minHeight: 48, borderRadius: 12, border: 'none',
                      background: COLORS.borderLight, color: COLORS.warmGrey,
                      fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmShare}
                    disabled={pickedCategories.length === 0}
                    style={{
                      flex: 1, minHeight: 48, borderRadius: 12, border: 'none',
                      background: pickedCategories.length > 0 ? COLORS.action : COLORS.border,
                      color: pickedCategories.length > 0 ? 'white' : COLORS.warmGrey,
                      fontSize: 14, fontWeight: 600,
                      cursor: pickedCategories.length > 0 ? 'pointer' : 'default', fontFamily: 'inherit',
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
