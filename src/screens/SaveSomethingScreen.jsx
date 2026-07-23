import { useState, useRef, useEffect } from 'react'
import { PLATFORMS, CATEGORY_HINTS, detectSourceFromLink, isImagePhoto } from '../data'
import { fetchLinkPreview } from '../linkPreview'
import { TEXT, COLORS, SPACING } from '../styles'
import { BackButton } from '../components/BackButton'

function MemberCircle({ m }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%', background: m.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 700, color: 'white',
      border: '2px solid white', marginLeft: -6, flexShrink: 0,
    }}>
      {m.initial}
    </div>
  )
}

export function SaveSomethingScreen({ navigate, params = {}, allCategories, saveToMyIdeas, addToGroup, addCustomCategory, hasGroup, trips, currentTrip, openTrip, openModal, closeModal }) {
  const [titleValue, setTitleValue]   = useState('')
  const [linkValue, setLinkValue]     = useState('')
  const [noteValue, setNoteValue]     = useState('')
  const [photo, setPhoto]             = useState('')
  const fileInputRef                  = useRef(null)
  const [platform, setPlatform]       = useState('')
  const [customSource, setCustomSource] = useState('')
  const [sourceFocused, setSourceFocused] = useState(false)
  const [categoryIds, setCategoryIds] = useState(params.categoryId ? [params.categoryId] : [])
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [previewStatus, setPreviewStatus] = useState('idle') // idle | loading | done

  const title = titleValue.trim()
  // A link, photo, or note already identifies the item at a glance, so
  // title only needs to be required when none of those exist either —
  // otherwise it reintroduces the original "unidentifiable item" problem,
  // and only a completely blank save attempt should be blocked.
  const hasOtherContent = !!photo || linkValue.trim().length > 0 || noteValue.trim().length > 0
  const canSave = (title.length > 0 || hasOtherContent) && categoryIds.length > 0
  const isGroupMode = params.mode === 'group'
  const resolvedSource = platform === 'Other' && customSource.trim() ? customSource.trim() : platform

  const goBack = () => navigate(params.backTo || 'individualHome', params.returnParams || {})

  const handleLinkChange = (e) => {
    const value = e.target.value
    setLinkValue(value)
    const detected = detectSourceFromLink(value)
    if (detected) setPlatform(detected)
  }

  // Debounced so a preview isn't fetched on every keystroke — only once
  // the user pauses. Never overwrites a photo the user already has
  // (uploaded manually or from an earlier preview they kept), and never
  // overwrites a title they've already typed themselves.
  useEffect(() => {
    const trimmed = linkValue.trim()
    if (!trimmed) { setPreviewStatus('idle'); return }

    setPreviewStatus('loading')
    let cancelled = false
    const timer = setTimeout(async () => {
      const preview = await fetchLinkPreview(trimmed)
      if (cancelled) return
      if (preview?.image) setPhoto(prev => prev || preview.image)
      if (preview?.title) setTitleValue(prev => prev || preview.title)
      setPreviewStatus('done')
    }, 600)

    return () => { cancelled = true; clearTimeout(timer) }
  }, [linkValue])

  const toggleCategory = (id) => {
    setCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  // Images are read into a data URL and stored alongside the item's other
  // fields, same as notes and links — no server upload for this prototype.
  // Videos just keep their filename as a placeholder for now.
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type.startsWith('video/')) {
      setPhoto(file.name)
    } else {
      const reader = new FileReader()
      reader.onload = () => setPhoto(reader.result)
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  const doShare = (tripId) => {
    // Resolved and passed explicitly rather than left for addToGroup to
    // infer from the "current" trip — openTrip's state update hasn't taken
    // effect yet at this point in the same tick, so relying on it here
    // would tag the item to whatever trip was current before this switch.
    const targetTripId = tripId || currentTrip?.id
    if (tripId) openTrip(tripId)
    addToGroup({ title, note: noteValue.trim(), link: linkValue.trim(), platform: resolvedSource, categoryIds, hasPhoto: !!photo, photo, tripId: targetTripId })
    navigate('shareSuccess', { categoryIds })
  }

  const handleShare = () => {
    if (!canSave || !hasGroup) return
    if (trips && trips.length > 1) {
      openModal(
        <div
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div style={{ background: 'white', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ flex: 1, fontSize: 20, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.5 }}>Which trip is this for?</h3>
              <button onClick={closeModal} style={{ background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {trips.map(trip => (
                <button
                  key={trip.id}
                  onClick={() => { closeModal(); doShare(trip.id) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    border: `1.5px solid ${COLORS.border}`, borderRadius: 14,
                    background: 'white', padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.charcoal, letterSpacing: -0.2, marginBottom: 2 }}>{trip.name}</p>
                    {trip.destination && <p style={{ fontSize: 12, color: COLORS.warmGrey, fontWeight: 500 }}>📍 {trip.destination}</p>}
                  </div>
                  {trip.members && trip.members.length > 0 && (
                    <div style={{ display: 'flex', paddingLeft: 6 }}>
                      {trip.members.slice(0, 4).map(m => <MemberCircle key={m.id} m={m} />)}
                    </div>
                  )}
                  <span style={{ fontSize: 16, color: COLORS.subtleIcon }}>›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
      return
    }
    doShare()
  }

  const handleKeep = () => {
    if (!canSave) return
    saveToMyIdeas({ title, note: noteValue.trim(), link: linkValue.trim(), platform: resolvedSource, categoryIds, hasPhoto: !!photo, photo })
    goBack()
  }

  const handleAddCategory = () => {
    const name = newCategoryName.trim()
    if (!name) return
    const newId = addCustomCategory(name)
    setCategoryIds(prev => [...prev, newId])
    setNewCategoryName('')
    setAddingCategory(false)
  }

  const cancelAddCategory = () => {
    setAddingCategory(false)
    setNewCategoryName('')
  }

  return (
    <div className="screen" style={{ background: 'white' }}>
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${COLORS.border}` }}>
        <BackButton onClick={goBack} />
        <p style={{ fontSize: 22, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.4 }}>Save something</p>
      </div>

      <div className="screen-scroll" style={{ padding: `20px ${SPACING.screenX}px 40px` }}>

        {/* Title — first, so it's always available to fill in right away
            and edit later; required only when there's nothing else (no
            link, photo, or note) to identify the item by. Auto-fill from
            a link preview (below) may overwrite this after the user has
            already typed something — expected with this field order, not
            a bug, since the preview only fills in what's still empty. */}
        <p style={{ ...TEXT.sectionHeading, marginBottom: 8 }}>
          Title {hasOtherContent && <span style={{ textTransform: 'none', fontWeight: 500, color: COLORS.warmGrey }}>Optional</span>}
        </p>
        <input
          value={titleValue}
          onChange={e => setTitleValue(e.target.value)}
          placeholder={hasOtherContent ? "Give it a name (optional)" : "Give it a name (e.g. Cliffs of Moher hike)"}
          style={{
            width: '100%', minHeight: SPACING.inputMinHeight, borderRadius: 12,
            border: `1.5px solid ${titleValue ? COLORS.teal : COLORS.border}`, padding: '0 16px',
            fontSize: 15, fontWeight: 600, color: COLORS.charcoal, background: COLORS.bgMyIdeas,
            fontFamily: 'inherit', marginBottom: 28, boxSizing: 'border-box',
          }}
        />

        {/* Link — optional */}
        <p style={{ ...TEXT.sectionHeading, marginBottom: 8 }}>
          Link <span style={{ textTransform: 'none', fontWeight: 500, color: COLORS.warmGrey }}>Optional</span>
        </p>
        <input
          value={linkValue}
          onChange={handleLinkChange}
          placeholder="Paste a URL…"
          style={{
            width: '100%', minHeight: SPACING.inputMinHeight, borderRadius: 12,
            border: `1.5px solid ${COLORS.teal}`, padding: '0 16px',
            fontSize: 14, color: COLORS.charcoal, background: COLORS.bgMyIdeas,
            fontFamily: 'inherit', boxSizing: 'border-box',
          }}
        />
        {previewStatus === 'loading' && (
          <p style={{ fontSize: 12, color: COLORS.warmGrey, fontStyle: 'italic', marginTop: 6 }}>
            Fetching preview…
          </p>
        )}
        <div style={{ marginBottom: previewStatus === 'loading' ? 8 : 14 }} />

        {/* Note — always visible under the link field */}
        <textarea
          value={noteValue}
          onChange={e => setNoteValue(e.target.value)}
          placeholder="Add a note so you remember what this is (e.g. Cozy café near Temple Bar)"
          rows={3}
          style={{
            width: '100%', border: `1.5px solid ${COLORS.teal}`,
            borderRadius: 14, padding: '14px 16px',
            fontSize: 14, color: COLORS.charcoal, background: COLORS.bgMyIdeas,
            fontFamily: 'inherit', resize: 'none', lineHeight: 1.6,
            marginBottom: 14, boxSizing: 'border-box',
          }}
        />

        {/* Photo/video — optional, combinable, read client-side and stored as a data URL */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              border: `1.5px solid ${photo ? COLORS.teal : COLORS.border}`,
              borderRadius: 12, padding: '10px 14px',
              background: photo ? COLORS.tealTint : 'white', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 16 }}>{photo && !isImagePhoto(photo) ? '🎬' : '📷'}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: photo ? COLORS.teal : COLORS.warmGrey }}>
              {!photo ? 'Add a photo or video' : isImagePhoto(photo) ? 'Photo attached' : `Video attached: ${photo}`}
            </span>
          </button>
          {photo && isImagePhoto(photo) && (
            <div style={{ marginTop: 10, position: 'relative', width: 90, height: 90 }}>
              <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
              <button
                onClick={() => setPhoto('')}
                style={{
                  position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%',
                  border: '2px solid white', background: COLORS.danger, color: 'white',
                  fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Source selector */}
        <p style={{ ...TEXT.sectionHeading, marginBottom: 12 }}>
          Source
        </p>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: platform === 'Other' ? 10 : 28, scrollbarWidth: 'none' }}>
          {PLATFORMS.map(p => {
            const selected = platform === p
            return (
              <button
                key={p}
                onClick={() => { setPlatform(selected ? '' : p); if (p !== 'Other') setCustomSource('') }}
                style={{
                  height: 32, borderRadius: 12, padding: '0 12px', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
                  display: 'flex', alignItems: 'center',
                  background: selected ? COLORS.terracotta : COLORS.sand,
                  color: selected ? 'white' : COLORS.warmGrey,
                }}
              >
                {p}
              </button>
            )
          })}
        </div>

        <div
          style={{
            maxHeight: platform === 'Other' ? 56 : 0,
            opacity: platform === 'Other' ? 1 : 0,
            marginBottom: platform === 'Other' ? 28 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.22s ease, opacity 0.18s ease, margin-bottom 0.22s ease',
          }}
        >
          <input
            value={customSource}
            onChange={e => setCustomSource(e.target.value)}
            onFocus={() => setSourceFocused(true)}
            onBlur={() => setSourceFocused(false)}
            placeholder="Type your source"
            style={{
              width: '100%', minHeight: SPACING.inputMinHeight, borderRadius: 12,
              border: `1.5px solid ${sourceFocused ? COLORS.teal : COLORS.border}`,
              padding: '0 16px',
              fontSize: 14, color: COLORS.charcoal, background: COLORS.bgMyIdeas,
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Tags — multi-select */}
        <p style={{ ...TEXT.sectionHeading, marginBottom: 12 }}>
          Tag it (choose one or more)
        </p>
        <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 32, border: `1px solid ${COLORS.border}` }}>
          {allCategories.map((cat, i) => {
            const selected = categoryIds.includes(cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                style={{
                  width: '100%', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', textAlign: 'left',
                  background: selected ? `${COLORS.terracotta}12` : 'white',
                  borderBottom: `1px solid ${COLORS.borderLight}`,
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
                <span style={{ fontSize: 18, width: 24, flexShrink: 0 }}>{cat.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ ...TEXT.categoryRowName, display: 'block', color: selected ? COLORS.terracotta : COLORS.charcoal }}>
                    {cat.label}
                  </span>
                  {CATEGORY_HINTS[cat.id] && (
                    <span style={{ fontSize: 12, color: COLORS.warmGrey, display: 'block', marginTop: 1 }}>
                      {CATEGORY_HINTS[cat.id]}
                    </span>
                  )}
                </div>
              </button>
            )
          })}

          {/* Add a new section */}
          {!addingCategory ? (
            <button
              onClick={() => setAddingCategory(true)}
              style={{
                width: '100%', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', textAlign: 'left', background: 'white',
              }}
            >
              <span style={{ fontSize: 16, width: 24, flexShrink: 0, textAlign: 'center', color: COLORS.teal, fontWeight: 700 }}>+</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.teal, flex: 1 }}>
                Add a new section
              </span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, padding: '10px 16px' }}>
              <input
                autoFocus
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); if (e.key === 'Escape') cancelAddCategory() }}
                placeholder="Name your section"
                style={{
                  flex: 1, height: 40, borderRadius: 10,
                  border: `1.5px solid ${COLORS.teal}`,
                  padding: '0 12px', fontSize: 14, color: COLORS.charcoal,
                  background: COLORS.bgMyIdeas, fontFamily: 'inherit',
                }}
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                style={{
                  background: newCategoryName.trim() ? COLORS.teal : COLORS.border,
                  color: newCategoryName.trim() ? 'white' : COLORS.warmGrey,
                  border: 'none', borderRadius: 10, padding: '0 14px',
                  fontSize: 13, fontWeight: 600,
                  cursor: newCategoryName.trim() ? 'pointer' : 'default',
                  flexShrink: 0,
                }}
              >
                Add
              </button>
              <button
                onClick={cancelAddCategory}
                style={{
                  background: 'none', border: 'none', color: COLORS.warmGrey,
                  fontSize: 20, cursor: 'pointer', padding: '0 4px', flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Whichever action matches how the user got here is the primary
            (solid) button and comes first; the other stays available but
            secondary (outlined) — reached via Group Space, "Share with
            Group" is expected and primary; reached via My Ideas/My Saves,
            "Keep" is expected and primary. Neither ever fires without the
            user picking it explicitly. "Share with Group" only appears at
            all once a trip exists — starting one is the home screen's job. */}
        {hasGroup && isGroupMode && (
          <button
            onClick={handleShare}
            disabled={!canSave}
            style={{
              width: '100%', minHeight: SPACING.buttonMinHeight, borderRadius: 14, border: 'none',
              background: canSave ? COLORS.action : COLORS.border,
              color: canSave ? 'white' : COLORS.warmGrey,
              fontSize: 15, fontWeight: 600, cursor: canSave ? 'pointer' : 'default',
              marginBottom: 10, letterSpacing: -0.2,
            }}
          >
            Share with Group
          </button>
        )}

        <button
          onClick={handleKeep}
          disabled={!canSave}
          style={isGroupMode ? {
            width: '100%', minHeight: SPACING.buttonMinHeight, borderRadius: 14,
            border: `2px solid ${canSave ? COLORS.action : COLORS.border}`,
            background: 'white',
            color: canSave ? COLORS.action : COLORS.warmGrey,
            fontSize: 15, fontWeight: 600, cursor: canSave ? 'pointer' : 'default',
            letterSpacing: -0.2,
          } : {
            width: '100%', minHeight: SPACING.buttonMinHeight, borderRadius: 14, border: 'none',
            background: canSave ? COLORS.action : COLORS.border,
            color: canSave ? 'white' : COLORS.warmGrey,
            fontSize: 15, fontWeight: 600, cursor: canSave ? 'pointer' : 'default',
            marginBottom: hasGroup ? 10 : 0, letterSpacing: -0.2,
          }}
        >
          Keep in My Ideas
        </button>

        {hasGroup && !isGroupMode && (
          <button
            onClick={handleShare}
            disabled={!canSave}
            style={{
              width: '100%', minHeight: SPACING.buttonMinHeight, borderRadius: 14,
              border: `2px solid ${canSave ? COLORS.action : COLORS.border}`,
              background: 'white',
              color: canSave ? COLORS.action : COLORS.warmGrey,
              fontSize: 15, fontWeight: 600, cursor: canSave ? 'pointer' : 'default',
              letterSpacing: -0.2,
            }}
          >
            Share with Group
          </button>
        )}
      </div>
    </div>
  )
}
