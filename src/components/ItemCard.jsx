import { useState } from 'react'
import { timeAgo, PLATFORMS, isImagePhoto, displayTitle } from '../data'
import { COLORS, SHADOW_CARD, TEXT } from '../styles'
import { ActionMenu, PencilIcon, TrashIcon } from './ActionMenu'
import { CategoryIcon } from './CategoryIcons'

function DotsIcon({ size = 14, color = COLORS.charcoal }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  )
}

function Pill({ label, icon, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '6px 12px', borderRadius: 20, fontFamily: 'inherit',
        border: `1.5px solid ${selected ? COLORS.teal : COLORS.border}`,
        background: selected ? COLORS.tealTint : 'white',
        color: selected ? COLORS.teal : COLORS.warmGrey,
        fontSize: 12, fontWeight: 600, cursor: 'pointer',
      }}
    >
      {icon}{label}
    </button>
  )
}

function EditForm({ item, categories, allCategories, onCancel, onSave }) {
  const [title, setTitle]     = useState(item.title || '')
  const [link, setLink]       = useState(item.link || '')
  const [note, setNote]       = useState(item.note || '')
  const [source, setSource]   = useState(item.platform || '')
  const [categoryIds, setCategoryIds] = useState((categories || []).map(c => c.id))

  // Title is always optional (same as the save flow) — displayTitle()
  // already falls back to a sensible name when it's empty.
  const canSave = categoryIds.length > 0

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
        placeholder="Title (optional)"
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
            label={c.label}
            icon={<CategoryIcon id={c.id} size={15} color={categoryIds.includes(c.id) ? COLORS.teal : (c.shade || COLORS.warmGrey)} />}
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
            color: canSave ? 'white' : COLORS.warmGrey,
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
export function ItemCard({ item, categories, contributor, source, note, hearts = 0, hearted = false, onToggleHeart, onOpen, previewHeight = 100, isOwner = true, onDelete, onSave, allCategories = [], hideFooter = false, starred = false, starredBy = [], onToggleStar, decidedTip = false, onDismissDecidedTip, sharedWithTripName, compact = false }) {
  const TopTag = onOpen ? 'button' : 'div'
  const primaryCategory = (categories && categories[0]) || { color: COLORS.teal, shade: COLORS.teal }
  const [pulsing, setPulsing] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const [fading, setFading] = useState(false)
  const [editing, setEditing] = useState(false)

  const handleHeart = () => {
    if (!onToggleHeart) return
    setPulsing(true)
    setTimeout(() => setPulsing(false), 220)
    onToggleHeart()
  }

  const closeMenu = () => setMenuAnchor(null)
  // Whole-card treatment reflects the group's decision (anyone marked it),
  // not just whether the current viewer personally did — otherwise the
  // badge and "Decided (n)" label would say one thing while the card
  // itself looked untouched for everyone except whoever clicked it.
  const isDecided = starredBy.length > 0

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

  // Compact mode — the private My Ideas card: a square thumbnail beside
  // title/source/category-pill, no contributor/timestamp/note/link badge
  // (none of those appear in the reference, and the item's full detail is
  // one tap away via onOpen anyway). Reuses the same menu/edit/delete
  // machinery as the full card below — only the top-level layout differs.
  // The group-decision card (Decided ribbon, heart/decided footer,
  // contributor attribution) is untouched; this branch never runs there
  // since only MyIdeasCategoryScreen passes `compact`.
  if (compact) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'relative', background: COLORS.cardBg, borderRadius: 16,
          boxShadow: SHADOW_CARD, opacity: fading ? 0 : 1, transition: 'opacity 200ms ease',
        }}>
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
                display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%',
                border: 'none', padding: 16, paddingRight: 40, margin: 0,
                background: 'none', textAlign: 'left', cursor: onOpen ? 'pointer' : 'default',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ width: 72, height: 88, borderRadius: 14, overflow: 'hidden', flexShrink: 0, background: `${primaryCategory.color}30` }}>
                {isImagePhoto(item.photo) ? (
                  <img src={item.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CategoryIcon id={primaryCategory.id} size={26} color={primaryCategory.shade || primaryCategory.color} />
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0, marginTop: 6 }}>
                <p style={{ ...TEXT.cardTitle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayTitle(item)}
                </p>
                {source && (
                  <p style={{ fontSize: 13, color: COLORS.warmGrey, marginTop: 6 }}>
                    {source}
                  </p>
                )}
                {categories && categories.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                    {categories.map(c => (
                      <span key={c.id} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: `${c.color}1F`, color: COLORS.charcoal,
                        fontSize: 12, fontWeight: 600, borderRadius: 20, padding: '3px 9px',
                      }}>
                        <CategoryIcon id={c.id} size={13} color={c.shade || COLORS.charcoal} /> {c.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </TopTag>
          )}

          {!editing && (
            <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (menuAnchor) { closeMenu(); return }
                  const rect = e.currentTarget.getBoundingClientRect()
                  setMenuAnchor({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
                }}
                aria-label="More options"
                style={{
                  width: 28, height: 28, borderRadius: '50%', border: 'none',
                  background: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <DotsIcon />
              </button>

              {menuAnchor && (
                <ActionMenu anchorRect={menuAnchor} rows={menuRows} onClose={closeMenu} />
              )}
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

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'relative',
          // A faint top-to-bottom gradient rather than one flat fill — the
          // difference is subtle on purpose (a couple percent, not a visible
          // band) but it's what keeps a plain white card from reading as a
          // flat rectangle of color the way a single solid fill does.
          background: isDecided
            ? `linear-gradient(180deg, ${COLORS.milestoneTint} 0%, #EDF5F0 100%)`
            : `linear-gradient(180deg, #FFFFFF 0%, #FCFAF8 100%)`,
          borderRadius: 14,
          border: `2px solid ${isDecided ? COLORS.milestone : 'transparent'}`,
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
            {/* Top zone — a real photo earns full-bleed visual space; a
                video gets a compact labeled strip; an item with neither
                still gets its own header (a right-sized emoji-on-colour
                block, not the old oversized one) rather than no header
                at all — every card gets a real visual anchor up top. */}
            {isImagePhoto(item.photo) ? (
              <div style={{ height: previewHeight, position: 'relative', overflow: 'hidden' }}>
                <img src={item.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                      background: COLORS.milestone, color: 'white',
                      fontSize: 11, fontWeight: 800, letterSpacing: 0.2,
                      borderRadius: 20, padding: '5px 10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                    }}
                  >
                    ✓ Decided
                  </span>
                )}
              </div>
            ) : item.photo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 44px 12px 16px', background: COLORS.sand }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>🎬</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.charcoal, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {item.photo}
                </span>
                {source && (
                  <span style={{ background: 'white', color: COLORS.charcoal, fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '4px 10px', flexShrink: 0 }}>
                    {source}
                  </span>
                )}
              </div>
            ) : (
              <div style={{
                height: 72, position: 'relative', overflow: 'hidden',
                background: `${primaryCategory.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CategoryIcon id={primaryCategory.id} size={30} color={primaryCategory.shade || primaryCategory.color} />
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
                      background: COLORS.milestone, color: 'white',
                      fontSize: 11, fontWeight: 800, letterSpacing: 0.2,
                      borderRadius: 20, padding: '5px 10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                    }}
                  >
                    ✓ Decided
                  </span>
                )}
              </div>
            )}

            {/* Middle zone — every branch above now ends in a header of
                its own, so the "⋯" button (absolutely positioned over the
                card's top-right corner) always overlays that header, never
                this row — no extra clearance needed here. */}
            <div style={{ padding: 16, paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  {contributor && (
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', background: contributor.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: 'white', lineHeight: 1, flexShrink: 0,
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

              <p style={TEXT.cardTitle}>
                {displayTitle(item)}
              </p>

              {/* Sharing copies, it never moves — the item stays in My Ideas
                  too, so this is the only way to tell, from that private
                  copy, that it's also sitting in a trip's Group Space. Only
                  ever one trip at a time, so a single badge is enough. */}
              {sharedWithTripName && (
                <span style={{
                  display: 'inline-block', marginTop: 6,
                  background: COLORS.tealTint, color: COLORS.teal,
                  fontSize: 11, fontWeight: 700, borderRadius: 8, padding: '3px 9px',
                }}>
                  🔗 Shared with {sharedWithTripName}
                </span>
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
                        fontSize: 11, lineHeight: 1, flexShrink: 0,
                      }}
                    >
                      🔗
                    </span>
                  )}
                  {(categories || []).map(c => (
                    <span key={c.id} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: `${c.color}1F`, color: COLORS.charcoal,
                      fontSize: 12, fontWeight: 600, borderRadius: 20, padding: '3px 9px',
                    }}>
                      <CategoryIcon id={c.id} size={14} color={c.shade || COLORS.charcoal} /> {c.label}
                    </span>
                  ))}
                </div>
              )}

              {starredBy.length > 0 && (
                <p style={{ fontSize: 12, color: COLORS.milestone, fontWeight: 600, marginTop: 8 }}>
                  ✓ Marked as decided by {starredBy.join(', ')}
                </p>
              )}
            </div>
          </TopTag>
        )}

        {/* Three-dot menu button — sibling of TopTag (not nested inside it) so it
            never ends up inside a <button>, and overlays the top-right corner.
            A visible fill + border rather than relying on the drop shadow
            alone, so it still reads as a tappable control on a plain white
            card (no photo underneath) and not just on a photo. The dropdown
            itself is the shared, `position: fixed` ActionMenu (anchored via
            the button's own bounding rect) rather than a locally-positioned
            one — this card's own container clips overflow for its rounded
            corners, which was silently cutting the menu off on short cards. */}
        {!editing && (
          <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (menuAnchor) { closeMenu(); return }
                const rect = e.currentTarget.getBoundingClientRect()
                setMenuAnchor({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
              }}
              aria-label="More options"
              style={{
                width: 30, height: 30, borderRadius: '50%',
                border: `1px solid ${COLORS.border}`,
                background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 6px rgba(0,0,0,0.14)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <DotsIcon />
            </button>

            {menuAnchor && (
              <ActionMenu anchorRect={menuAnchor} rows={menuRows} onClose={closeMenu} />
            )}
          </div>
        )}

        {/* One-time explainer for the decided toggle — anchored directly
            above the actual checkbox it's explaining (only ever shown on
            one card, the first, via the `decidedTip` prop) rather than a
            generic banner floating disconnected at the top of the screen.
            Dismissed by its own "x", or automatically the moment the user
            marks their first item as decided anywhere. */}
        {decidedTip && !editing && !hideFooter && onToggleStar && (
          <div style={{ margin: '12px 14px 14px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: COLORS.tealTint, borderRadius: 10, padding: '10px 12px',
            }}>
              <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>💡</span>
              <p style={{ flex: 1, fontSize: 12, color: COLORS.teal, fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
                Tip: tap the checkmark below to mark this as your group's pick.
              </p>
              <button
                onClick={onDismissDecidedTip}
                aria-label="Dismiss tip"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 16, lineHeight: 1, color: COLORS.teal, flexShrink: 0,
                  width: 20, height: 20, padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Bottom zone — heart pinned to the left edge, Decided pinned to
            the right edge, so the two actions land at a consistent,
            predictable spot on every card regardless of how much text
            either one has. */}
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
                border: `2px solid ${starred ? COLORS.milestone : COLORS.subtleIcon}`,
                background: starred ? COLORS.milestone : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {starred && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 12 9 17 20 6" />
                  </svg>
                )}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: starred ? COLORS.milestone : COLORS.warmGrey }}>
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
