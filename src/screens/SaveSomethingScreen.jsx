import { useState } from 'react'
import { PLATFORMS } from '../data'
import { TEXT, COLORS, SPACING } from '../styles'
import { BackButton } from '../components/BackButton'

const INPUT_OPTIONS = [
  { id: 'link', icon: '🌐', label: 'Add a link' },
  { id: 'note', icon: '✏️', label: 'Write a note' },
  { id: 'photo', icon: '📷', label: 'Upload photo or video' },
  { id: 'file', icon: '📎', label: 'Add a file' },
]

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

export function SaveSomethingScreen({ navigate, params = {}, allCategories, saveToMyIdeas, addToGroup, addCustomCategory, hasGroup, trips, openTrip, openModal, closeModal }) {
  const [activeInput, setActiveInput] = useState(params.draftActiveInput || null)
  const [linkValue, setLinkValue]     = useState(params.draftLinkValue || '')
  const [noteValue, setNoteValue]     = useState(params.draftNoteValue || '')
  const [platform, setPlatform]       = useState(params.draftPlatform || '')
  const [customSource, setCustomSource] = useState(params.draftCustomSource || '')
  const [sourceFocused, setSourceFocused] = useState(false)
  const [categoryId, setCategoryId]   = useState(params.categoryId || '')
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const title = activeInput === 'link' ? linkValue.trim() : activeInput === 'note' ? noteValue.trim() : ''
  const canSave = title && categoryId
  const isGroupMode = params.mode === 'group'
  const resolvedSource = platform === 'Other' && customSource.trim() ? customSource.trim() : platform

  const goBack = () => navigate(params.backTo || 'individualHome', params.returnParams || {})

  const openCreateGroup = () => {
    navigate('createTrip', {
      returnTo: 'saveSomething',
      returnParams: {
        ...params,
        categoryId,
        draftActiveInput: activeInput,
        draftLinkValue: linkValue,
        draftNoteValue: noteValue,
        draftPlatform: platform,
        draftCustomSource: customSource,
      },
    })
  }

  const handleOptionTap = (id) => {
    if (id === 'photo') { alert('Photo and video upload coming soon'); return }
    if (id === 'file')  { alert('File upload coming soon'); return }
    setActiveInput(prev => prev === id ? null : id)
  }

  const doShare = (tripId) => {
    if (tripId) openTrip(tripId)
    addToGroup({ title, platform: resolvedSource || 'Other', categoryId })
    navigate('shareSuccess', { categoryId })
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
                  <span style={{ fontSize: 16, color: '#D6CCBF' }}>›</span>
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
    saveToMyIdeas({ title, platform: resolvedSource || 'Other', categoryId })
    goBack()
  }

  const handleAddCategory = () => {
    const name = newCategoryName.trim()
    if (!name) return
    const newId = addCustomCategory(name)
    setCategoryId(newId)
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

        {/* 2x2 input option grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {INPUT_OPTIONS.map(opt => {
            const selected = activeInput === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => handleOptionTap(opt.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 8, padding: '18px 12px',
                  border: `2px solid ${selected ? COLORS.teal : COLORS.border}`,
                  borderRadius: 14,
                  background: selected ? COLORS.tealTint : 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 28, color: COLORS.teal }}>{opt.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.charcoal, textAlign: 'center', lineHeight: 1.3 }}>
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Expanded input */}
        {activeInput === 'link' && (
          <input
            autoFocus
            value={linkValue}
            onChange={e => setLinkValue(e.target.value)}
            placeholder="Paste a URL…"
            style={{
              width: '100%', minHeight: SPACING.inputMinHeight, borderRadius: 12,
              border: `1.5px solid ${COLORS.teal}`, padding: '0 16px',
              fontSize: 14, color: COLORS.charcoal, background: COLORS.bgMyIdeas,
              fontFamily: 'inherit', marginBottom: 16, boxSizing: 'border-box',
            }}
          />
        )}
        {activeInput === 'note' && (
          <textarea
            autoFocus
            value={noteValue}
            onChange={e => setNoteValue(e.target.value)}
            placeholder="Write a description or note…"
            rows={4}
            style={{
              width: '100%', border: `1.5px solid ${COLORS.teal}`,
              borderRadius: 14, padding: '14px 16px',
              fontSize: 14, color: COLORS.charcoal, background: COLORS.bgMyIdeas,
              fontFamily: 'inherit', resize: 'none', lineHeight: 1.6,
              marginBottom: 16, boxSizing: 'border-box',
            }}
          />
        )}

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

        {/* Category selector */}
        <p style={{ ...TEXT.sectionHeading, marginBottom: 12 }}>
          Where does this belong?
        </p>
        <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 32, border: `1px solid ${COLORS.border}` }}>
          {allCategories.map((cat, i) => {
            const selected = categoryId === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryId(selected ? '' : cat.id)}
                style={{
                  width: '100%', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', textAlign: 'left',
                  background: selected ? `${COLORS.terracotta}12` : 'white',
                  borderBottom: `1px solid ${COLORS.borderLight}`,
                  borderLeft: selected ? `3px solid ${COLORS.terracotta}` : '3px solid transparent',
                }}
              >
                <span style={{ fontSize: 18, width: 24, flexShrink: 0 }}>{cat.icon}</span>
                <span style={{ ...TEXT.categoryRowName, flex: 1, color: selected ? COLORS.terracotta : COLORS.charcoal }}>
                  {cat.label}
                </span>
                {selected && <span style={{ fontSize: 15, color: COLORS.terracotta }}>✓</span>}
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
                  color: newCategoryName.trim() ? 'white' : '#A79E93',
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

        {/* Action buttons */}
        <button
          onClick={handleShare}
          disabled={!canSave || !hasGroup}
          style={{
            width: '100%', minHeight: SPACING.buttonMinHeight, borderRadius: 14, border: isGroupMode ? `2.5px solid ${COLORS.teal}` : 'none',
            background: canSave && hasGroup ? COLORS.teal : COLORS.border,
            color: canSave && hasGroup ? 'white' : '#A79E93',
            fontSize: 15, fontWeight: 600, cursor: canSave && hasGroup ? 'pointer' : 'default',
            marginBottom: 10, letterSpacing: -0.2,
          }}
        >
          Share with Group
        </button>

        {!hasGroup && (
          <button
            onClick={openCreateGroup}
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, color: COLORS.teal,
              marginBottom: 12, padding: '4px 0',
            }}
          >
            Create a group trip
          </button>
        )}

        <button
          onClick={handleKeep}
          disabled={!canSave}
          style={{
            width: '100%', minHeight: SPACING.buttonMinHeight, borderRadius: 14,
            border: `2px solid ${canSave ? COLORS.teal : COLORS.border}`,
            background: 'white',
            color: canSave ? COLORS.teal : '#A79E93',
            fontSize: 15, fontWeight: 600, cursor: canSave ? 'pointer' : 'default',
            letterSpacing: -0.2,
          }}
        >
          Keep in My Ideas
        </button>
      </div>
    </div>
  )
}
