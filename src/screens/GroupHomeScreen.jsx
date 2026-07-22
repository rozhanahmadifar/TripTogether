import { useState } from 'react'
import { MEMBER_COLORS, truncateName, isValidEmail } from '../data'
import { DateRangePicker, fmtDate } from '../components/DateRangePicker'
import { BackButton } from '../components/BackButton'
import { XIcon } from '../components/ActionMenu'
import { TEXT, COLORS, SPACING, SHADOW_CARD } from '../styles'

function PencilIcon({ size = 13, color = COLORS.warmGrey }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function SavesCategoryRow({ cat, count, isLast, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', border: 'none', background: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 0', textAlign: 'left',
        borderBottom: isLast ? 'none' : `1px solid ${COLORS.borderLight}`,
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: '50%', background: `${cat.color}2A`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0,
      }}>
        {cat.icon}
      </div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: COLORS.charcoal }}>{cat.label}</span>
      <span style={{ fontSize: 13, color: COLORS.warmGrey }}>{count === 0 ? '—' : count}</span>
    </button>
  )
}

function GroupCategoryRow({ cat, count, contributors, getMember, isLast, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', border: 'none', background: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 0', textAlign: 'left',
        borderBottom: isLast ? 'none' : `1px solid ${COLORS.borderLight}`,
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: '50%', background: `${cat.color}2A`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0,
      }}>
        {cat.icon}
      </div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: COLORS.charcoal }}>{cat.label}</span>
      <span style={{ fontSize: 13, color: COLORS.warmGrey }}>{count === 0 ? '—' : count}</span>
      {contributors.length > 0 && (
        <div style={{ display: 'flex', marginLeft: 6 }}>
          {contributors.slice(0, 4).map((name, idx) => {
            const member = getMember(name)
            return (
              <div key={idx} style={{
                width: 16, height: 16, borderRadius: '50%',
                background: member?.color || COLORS.terracotta,
                border: '1.5px solid white',
                marginLeft: idx > 0 ? -5 : 0,
              }} />
            )
          })}
        </div>
      )}
    </button>
  )
}

export function GroupHomeScreen({ navigate, params = {}, currentTrip, myIdeas, groupItems, updateTrip, setTripDestination, customThreads, allCategories }) {
  const [editField, setEditField]       = useState(params.openDateEdit ? 'dates' : null)
  const [editValue, setEditValue]       = useState('')
  const [editDateRange, setEditDateRange] = useState({ start: null, end: null })
  const [newMemberName, setNewMemberName]   = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')

  if (!currentTrip) {
    return (
      <div className="screen" style={{ background: COLORS.bgGroupSpace }}>
        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
          <BackButton onClick={() => navigate('myTrips')} />
          <h2 style={TEXT.screenTitle}>Group Trip</h2>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: COLORS.warmGrey }}>No trip selected.</p>
        </div>
      </div>
    )
  }

  const tripMembers = currentTrip.members || []
  const pinnedThread = (customThreads?.[currentTrip.id] || []).find(t => t.pinned)
  // A trip whose destination was already filled in at creation never gets
  // a default Destination category — the trip header is the only place
  // that fact lives.
  const visibleCategories = allCategories.filter(c => !c.hidden && !(c.id === 'destination' && currentTrip.destinationSetAtCreation))

  // Trip home is a compact preview, capped to the top 3 most-active
  // categories — otherwise a trip with content everywhere would make this
  // look identical to "See all" and defeat the point of having both. The
  // full 6-category list (including empty ones) lives behind "See all".
  const countIn = (items, catId) => items.filter(i => i.categoryIds.includes(catId)).length
  const topCategories = (items) => visibleCategories
    .filter(cat => countIn(items, cat.id) > 0)
    .sort((a, b) => countIn(items, b.id) - countIn(items, a.id))
    .slice(0, 3)
  const groupCategoriesWithItems = topCategories(groupItems)
  // Surfaced on trip home as a visible entry point into the decisions
  // view — testing showed this otherwise goes unnoticed inside Group Space.
  const decidedCategoriesCount = visibleCategories.filter(cat =>
    groupItems.some(i => i.categoryIds.includes(cat.id) && (i.starredBy || []).length > 0)
  ).length
  // "My Saves" here is this trip's own private stash, not the user's whole
  // personal collection — never another trip's (or pre-trip) private items.
  const tripMyIdeas = myIdeas.filter(i => i.tripId === currentTrip.id)
  const savesCategoriesWithItems = topCategories(tripMyIdeas)

  const startEdit = (field, value = '') => { setEditField(field); setEditValue(value) }
  const cancelEdit = () => { setEditField(null); setEditValue(''); setEditDateRange({ start: null, end: null }) }

  const confirmEdit = () => {
    if (editField === 'name' && editValue.trim()) updateTrip(currentTrip.id, { name: editValue.trim() })
    // Editing the destination here is the same fact as the Destination
    // category's decided item, not a separate value — this keeps both in sync.
    if (editField === 'destination') setTripDestination(currentTrip.id, editValue)
    if (editField === 'budget') updateTrip(currentTrip.id, { budget: editValue.trim() })
    setEditField(null)
    setEditValue('')
  }

  const confirmDates = () => {
    if (editDateRange.start) {
      const label = editDateRange.end
        ? `${fmtDate(editDateRange.start)} – ${fmtDate(editDateRange.end)}`
        : fmtDate(editDateRange.start)
      updateTrip(currentTrip.id, { dates: label, startDate: editDateRange.start.toISOString() })
    }
    setEditField(null)
    setEditDateRange({ start: null, end: null })
  }

  const addMemberToTrip = () => {
    const n = newMemberName.trim()
    const email = newMemberEmail.trim()
    if (!n || !isValidEmail(email)) return
    const color = MEMBER_COLORS[tripMembers.length % MEMBER_COLORS.length]
    updateTrip(currentTrip.id, {
      members: [...tripMembers, { id: `m-${Date.now()}`, name: n, email, color, initial: n.charAt(0).toUpperCase() }]
    })
    setNewMemberName('')
    setNewMemberEmail('')
  }

  const removeMemberFromTrip = (memberId) => {
    updateTrip(currentTrip.id, { members: tripMembers.filter(m => m.id !== memberId) })
  }

  const getContributors = (categoryId) => {
    const items = groupItems.filter(i => i.categoryIds.includes(categoryId))
    return [...new Set(items.map(i => i.savedBy))]
  }

  const getMember = (name) => tripMembers.find(m => m.name === name)

  const pencilBtn = (field, value) => (
    <button
      onClick={() => editField === field ? cancelEdit() : startEdit(field, value)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '4px', flexShrink: 0, lineHeight: 1,
        width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0.8,
      }}
    >
      <PencilIcon color="rgba(255,255,255,0.75)" />
    </button>
  )

  const inlineInput = (placeholder, onConfirm) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        autoFocus
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onConfirm(); if (e.key === 'Escape') cancelEdit() }}
        placeholder={placeholder}
        style={{
          flex: 1, height: 40, borderRadius: 10, border: 'none',
          background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0 12px',
          fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
        }}
      />
      <button onClick={onConfirm} style={{ background: 'white', color: COLORS.teal, border: 'none', borderRadius: 10, padding: '0 12px', fontWeight: 700, cursor: 'pointer', fontSize: 13, flexShrink: 0 }}>Done</button>
      <button onClick={cancelEdit} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 10, padding: '0 10px', color: 'white', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>✕</button>
    </div>
  )

  return (
    <div className="screen" style={{ background: COLORS.bgGroupSpace }}>
      {/* Header with back button */}
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
        <BackButton onClick={() => navigate('myTrips')} />
        <h2 style={{ ...TEXT.screenTitle, fontSize: 19, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {currentTrip.name}
        </h2>
      </div>

      <div className="screen-scroll" style={{ padding: `16px ${SPACING.screenX}px ${SPACING.scrollBottomPad}px` }}>

        {/* Trip card — rich collaborative gradient, feels alive */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealLight} 100%)`,
          borderRadius: 18, padding: '20px',
          marginBottom: SPACING.sectionGap,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px ${COLORS.teal}40`,
        }}>
          {/* Trip name */}
          {editField === 'name' ? (
            <div style={{ marginBottom: 12 }}>{inlineInput('Trip name…', confirmEdit)}</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 }}>Current trip</p>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: -0.5, lineHeight: 1.1 }}>{currentTrip.name}</h2>
              </div>
              {pencilBtn('name', currentTrip.name)}
            </div>
          )}

          {/* Destination */}
          {editField === 'destination' ? (
            <div style={{ marginBottom: 10 }}>{inlineInput('Where are you going?', confirmEdit)}</div>
          ) : currentTrip.destination ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 500, flex: 1, color: 'rgba(255,255,255,0.88)' }}>
                📍 {currentTrip.destination}
              </p>
              {pencilBtn('destination', currentTrip.destination)}
            </div>
          ) : (
            <button
              onClick={() => startEdit('destination', '')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left',
              }}
            >
              <PencilIcon size={12} color="rgba(255,255,255,0.65)" />
              <span style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                Tap to add destination
              </span>
            </button>
          )}

          {/* Dates */}
          {currentTrip.dates ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
              <p style={{ fontSize: 13, fontWeight: 500, flex: 1, color: 'rgba(255,255,255,0.88)' }}>
                📅 {currentTrip.dates}
              </p>
              <button
                onClick={() => editField === 'dates' ? cancelEdit() : startEdit('dates')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '4px', flexShrink: 0, lineHeight: 1,
                  width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0.8,
                }}
              >
                <PencilIcon color="rgba(255,255,255,0.75)" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => editField === 'dates' ? cancelEdit() : startEdit('dates')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left',
              }}
            >
              <PencilIcon size={12} color="rgba(255,255,255,0.65)" />
              <span style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                Tap to add dates
              </span>
            </button>
          )}

          {/* Budget — a single simple number, no splitting or per-item cost tracking */}
          {editField === 'budget' ? (
            <div style={{ marginBottom: 18 }}>{inlineInput('Total budget…', confirmEdit)}</div>
          ) : currentTrip.budget ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
              <p style={{ fontSize: 13, fontWeight: 500, flex: 1, color: 'rgba(255,255,255,0.88)' }}>
                💰 Budget: {currentTrip.budget}
              </p>
              {pencilBtn('budget', currentTrip.budget)}
            </div>
          ) : (
            <button
              onClick={() => editField === 'budget' ? cancelEdit() : startEdit('budget')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left',
              }}
            >
              <PencilIcon size={12} color="rgba(255,255,255,0.65)" />
              <span style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                Tap to add a budget
              </span>
            </button>
          )}

          {/* Members — real people in a group photo */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', flex: 1 }}>
              {tripMembers.map(m => (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: m.color,
                    border: '2px solid white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: 'white',
                  }}>
                    {m.initial}
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }} title={m.name}>{truncateName(m.name)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setEditField(editField === 'members' ? null : 'members')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px', flexShrink: 0, lineHeight: 1,
                width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0.8,
              }}
            >
              <PencilIcon color="rgba(255,255,255,0.75)" />
            </button>
          </div>

          {/* Members edit panel */}
          {editField === 'members' && (
            <div style={{ marginTop: 14, background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: 14 }}>
              {tripMembers.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                    {m.initial}
                  </div>
                  <span style={{ flex: 1, color: 'white', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }} title={m.name}>{truncateName(m.name)}</span>
                  {m.id !== 'me' && (
                    <button onClick={() => removeMemberFromTrip(m.id)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <XIcon size={11} color="white" />
                    </button>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                <input
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMemberToTrip()}
                  placeholder="Name"
                  style={{ height: 36, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0 10px', fontSize: 13, fontFamily: 'inherit' }}
                />
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={e => setNewMemberEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMemberToTrip()}
                  placeholder="Email (required)"
                  style={{ height: 36, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0 10px', fontSize: 13, fontFamily: 'inherit' }}
                />
                <button
                  onClick={addMemberToTrip}
                  disabled={!newMemberName.trim() || !isValidEmail(newMemberEmail)}
                  style={{
                    height: 36, background: 'white', color: COLORS.teal, border: 'none', borderRadius: 8,
                    fontWeight: 700, fontSize: 13,
                    cursor: (newMemberName.trim() && isValidEmail(newMemberEmail)) ? 'pointer' : 'default',
                    opacity: (newMemberName.trim() && isValidEmail(newMemberEmail)) ? 1 : 0.5,
                  }}
                >
                  Add
                </button>
                <button
                  onClick={cancelEdit}
                  style={{
                    height: 36, background: 'rgba(255,255,255,0.12)', border: `1.5px solid rgba(255,255,255,0.3)`,
                    borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Date picker — below card when editing dates */}
        {editField === 'dates' && (
          <div style={{ marginBottom: SPACING.sectionGap, marginTop: -SPACING.sectionGap + 8 }}>
            <DateRangePicker
              startDate={editDateRange.start}
              endDate={editDateRange.end}
              onChange={range => setEditDateRange(range)}
              onDone={confirmDates}
            />
            <button onClick={cancelEdit} style={{ width: '100%', height: 40, marginTop: 8, borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: COLORS.warmGrey }}>
              Cancel
            </button>
          </div>
        )}

        {/* Direct link into this trip's discussion thread — so users don't
            have to guess which thread in the global Discuss tab is theirs. */}
        {pinnedThread && (
          <button
            onClick={() => navigate('discussThread', { threadId: pinnedThread.id, backTo: 'groupHome' })}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              background: COLORS.cardBg, borderRadius: 14, boxShadow: SHADOW_CARD,
              padding: 16, border: 'none', cursor: 'pointer', textAlign: 'left',
              marginBottom: SPACING.cardGap, fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 20 }}>💬</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.charcoal, letterSpacing: -0.2 }}>
                {pinnedThread.title} discussion
              </p>
              <p style={{ fontSize: 12, color: COLORS.warmGrey, marginTop: 1 }}>
                Jump into your trip's conversation
              </p>
            </div>
            <span style={{ fontSize: 16, color: '#D6CCBF' }}>›</span>
          </button>
        )}

        {/* Progress/decisions entry point — visible on trip home itself
            rather than requiring "Group Space" then "See all", since
            testing showed users didn't find it unaided otherwise. */}
        {visibleCategories.length > 0 && (
          <button
            onClick={() => navigate('groupSpace', { initialView: 'decided' })}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              background: COLORS.cardBg, borderRadius: 14, boxShadow: SHADOW_CARD,
              padding: 16, border: 'none', cursor: 'pointer', textAlign: 'left',
              marginBottom: SPACING.cardGap, fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 20 }}>✅</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.charcoal, letterSpacing: -0.2 }}>
                {decidedCategoriesCount} of {visibleCategories.length} {visibleCategories.length === 1 ? 'category' : 'categories'} decided
              </p>
              <p style={{ fontSize: 12, color: COLORS.warmGrey, marginTop: 1 }}>
                See the full plan
              </p>
            </div>
            <span style={{ fontSize: 16, color: '#D6CCBF' }}>›</span>
          </button>
        )}

        {/* Trip Summary — a clean read-only overview of the trip's key
            facts, reachable straight from trip home. */}
        <button
          onClick={() => navigate('tripSummary')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            background: COLORS.cardBg, borderRadius: 14, boxShadow: SHADOW_CARD,
            padding: 16, border: 'none', cursor: 'pointer', textAlign: 'left',
            marginBottom: SPACING.cardGap, fontFamily: 'inherit',
          }}
        >
          <span style={{ fontSize: 20 }}>📋</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.charcoal, letterSpacing: -0.2 }}>
              Trip Summary
            </p>
            <p style={{ fontSize: 12, color: COLORS.warmGrey, marginTop: 1 }}>
              Destination, accommodation, activities, transport & budget
            </p>
          </div>
          <span style={{ fontSize: 16, color: '#D6CCBF' }}>›</span>
        </button>

        {/* Group Space — open, collaborative. Shown first: this is the shared
            space testers expect to land on inside a group trip. */}
        <div style={{
          background: COLORS.cardBg, borderRadius: 14, boxShadow: SHADOW_CARD,
          padding: 16, borderLeft: `3px solid ${COLORS.teal}`,
          marginBottom: SPACING.cardGap,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
            <span style={{ flex: 1, fontSize: 11, fontWeight: 700, color: COLORS.teal, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Group Space
            </span>
            <button
              onClick={() => navigate('groupSpace')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: COLORS.teal, padding: 0 }}
            >
              See all
            </button>
          </div>
          <p style={{ fontSize: 12, color: COLORS.warmGrey, fontStyle: 'italic', marginBottom: 10 }}>
            {groupItems.length === 0 ? 'Nothing saved yet' : 'Everyone in the group can see these'}
          </p>
          <div>
            {groupCategoriesWithItems.map((cat, i) => (
              <GroupCategoryRow
                key={cat.id}
                cat={cat}
                count={groupItems.filter(i => i.categoryIds.includes(cat.id)).length}
                contributors={getContributors(cat.id)}
                getMember={getMember}
                isLast={i === groupCategoriesWithItems.length - 1}
                onClick={() => navigate('groupCategory', { categoryId: cat.id, backTo: 'groupHome' })}
              />
            ))}
          </div>
        </div>

        {/* My Saves — still your private space, even inside a group trip.
            Orange border + lock icon + explicit "Private" label keep it
            visually distinct so it's never mistaken for shared content. */}
        <div style={{
          background: COLORS.cardBg, borderRadius: 14, boxShadow: SHADOW_CARD,
          padding: 16, borderLeft: `3px solid ${COLORS.terracotta}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ flex: 1, fontSize: 11, fontWeight: 700, color: COLORS.teal, letterSpacing: 1.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
              🔒 My Saves
            </span>
            <button
              onClick={() => navigate('mySaves')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: COLORS.teal, padding: 0 }}
            >
              See all
            </button>
          </div>
          <p style={{ fontSize: 12, color: COLORS.warmGrey, fontStyle: 'italic', marginBottom: 10 }}>
            {tripMyIdeas.length === 0 ? 'Nothing saved yet' : 'Private, only you can see these'}
          </p>
          <div>
            {savesCategoriesWithItems.map((cat, i) => (
              <SavesCategoryRow
                key={cat.id}
                cat={cat}
                count={tripMyIdeas.filter(i => i.categoryIds.includes(cat.id)).length}
                isLast={i === savesCategoriesWithItems.length - 1}
                onClick={() => navigate('myIdeasCategory', { categoryId: cat.id, backTo: 'groupHome', tripScoped: true })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
