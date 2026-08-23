import { useState } from 'react'
import { nextMemberColor, truncateName, isValidEmail, daysUntil, countdownLabel, CATEGORY_PHOTOS } from '../data'
import { DateRangePicker, fmtDate } from '../components/DateRangePicker'
import { BackButton } from '../components/BackButton'
import { XIcon, PlusIcon } from '../components/ActionMenu'
import { ChatIcon } from '../components/TabIcons'
import { ProgressRing } from '../components/ProgressRing'
import { TEXT, COLORS, SPACING, SHADOW_CARD, tripCardBackground } from '../styles'

// Proportional rather than a fixed "out of 6" — the category list is
// dynamic (custom categories, hidden ones), so this scales to whatever
// count a given trip actually has. "Exactly one left" is called out on
// its own so a near-complete trip (4 of 5, 5 of 6, ...) reads as "almost
// ready" rather than landing in the same bucket as a plain 50/50 split.
function progressMicrocopy(decided, total) {
  if (total === 0) return ''
  if (decided === 0) return 'Just getting started'
  if (decided === total) return 'All set!'
  if (total - decided === 1) return 'Almost ready to go'
  if (decided / total >= 0.5) return 'Halfway there'
  return 'Making progress'
}

function PencilIcon({ size = 13, color = COLORS.warmGrey }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function ClipboardIcon({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 15h6M9 19h3" />
    </svg>
  )
}

// The shared circular footprint every leading row-icon on this screen now
// uses (Discussion / Categories decided / Trip Summary) — before this, one
// row's icon was a bare 20px emoji and another was a 44px progress ring
// with its own background disc, so the three stacked rows didn't line up
// or carry the same visual weight. Giving all three the same badge size
// (or, for the ring, the same outer diameter) fixes that.
const ROW_ICON_SIZE = 36
function RowIconBadge({ children, bg = COLORS.tealTint }) {
  return (
    <div style={{
      width: ROW_ICON_SIZE, height: ROW_ICON_SIZE, borderRadius: '50%', flexShrink: 0,
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {children}
    </div>
  )
}

// One of the four equal-sized quick-access cards below the Discussions row
// (Trip Summary, Categories, Group Space, My Ideas) — icon/ring badge on
// top, title, one short line of subtext, no trailing chevron (unlike the
// full-width rows elsewhere on this screen) since a 2x2 grid of tiles reads
// as tappable on its own without one.
function QuickAccessTile({ badge, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
        background: COLORS.cardBg, borderRadius: 14, boxShadow: SHADOW_CARD,
        padding: 16, border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
      }}
    >
      {badge}
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.charcoal, letterSpacing: -0.2, marginBottom: 2 }}>
          {title}
        </p>
        <p style={{ fontSize: 12, color: COLORS.warmGrey, lineHeight: 1.35 }}>
          {subtitle}
        </p>
      </div>
    </button>
  )
}

export function GroupHomeScreen({ navigate, params = {}, currentTrip, groupItems, updateTrip, setTripDestination, customThreads, allCategories }) {
  // Everything about the card — name, destination, dates, budget, and
  // members — now opens from the single edit icon at the top of the card
  // instead of a pencil scattered next to each field.
  const [newMemberName, setNewMemberName]   = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')

  const [cardEditing, setCardEditing]   = useState(!!params.openDateEdit)
  const [ceName, setCeName]             = useState(currentTrip?.name || '')
  const [ceDestination, setCeDestination] = useState(currentTrip?.destination || '')
  const [ceBudget, setCeBudget]         = useState(currentTrip?.budget || '')
  const [ceDatesOpen, setCeDatesOpen]   = useState(!!params.openDateEdit)
  const [ceDateRange, setCeDateRange]   = useState({ start: null, end: null })

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
  const hasAnyTripDetails = !!(currentTrip.destination || currentTrip.dates || currentTrip.budget)
  const pinnedThread = (customThreads?.[currentTrip.id] || []).find(t => t.pinned)
  // A trip whose destination was already filled in at creation never gets
  // a default Destination category — the trip header is the only place
  // that fact lives.
  const visibleCategories = allCategories.filter(c => !c.hidden && !(c.id === 'destination' && currentTrip.destinationSetAtCreation))

  // Surfaced on trip home as a visible entry point into the decisions
  // view — testing showed this otherwise goes unnoticed inside Group Space.
  const decidedCategoriesCount = visibleCategories.filter(cat =>
    groupItems.some(i => i.categoryIds.includes(cat.id) && (i.starredBy || []).length > 0)
  ).length
  const allCategoriesDecided = visibleCategories.length > 0 && decidedCategoriesCount === visibleCategories.length

  // Name, destination, dates, and budget open together in one panel —
  // separately they added up to a pencil per field scattered around the
  // card for what's really one "edit trip details" action. Re-prefilled
  // from the trip each time it opens except dates, which always starts
  // blank — the picker only stores a start date and a formatted label,
  // not a reusable end date to restore.
  const openCardEdit = () => {
    setCeName(currentTrip.name || '')
    setCeDestination(currentTrip.destination || '')
    setCeBudget(currentTrip.budget || '')
    setCeDateRange({ start: null, end: null })
    setCeDatesOpen(false)
    setCardEditing(true)
  }
  const cancelCardEdit = () => setCardEditing(false)
  const saveCardEdit = () => {
    // Same fact as the Destination category's decided item, not a separate
    // value — this keeps both in sync.
    setTripDestination(currentTrip.id, ceDestination)
    const updates = {}
    if (ceName.trim() && ceName.trim() !== currentTrip.name) updates.name = ceName.trim()
    if (ceBudget.trim() !== (currentTrip.budget || '')) updates.budget = ceBudget.trim()
    if (ceDateRange.start) {
      updates.dates = ceDateRange.end
        ? `${fmtDate(ceDateRange.start)} – ${fmtDate(ceDateRange.end)}`
        : fmtDate(ceDateRange.start)
      updates.startDate = ceDateRange.start.toISOString()
    }
    if (Object.keys(updates).length > 0) updateTrip(currentTrip.id, updates)
    setCardEditing(false)
  }

  const addMemberToTrip = () => {
    const n = newMemberName.trim()
    const email = newMemberEmail.trim()
    if (!n || !isValidEmail(email)) return
    // Picked to be distinct from every existing member's color, rather than
    // hashed from the name, which can collide and put two similar-looking
    // avatars side by side in "Traveling with".
    const color = nextMemberColor(tripMembers.map(m => m.color))
    updateTrip(currentTrip.id, {
      members: [...tripMembers, { id: `m-${Date.now()}`, name: n, email, color, initial: n.charAt(0).toUpperCase() }]
    })
    setNewMemberName('')
    setNewMemberEmail('')
  }

  const removeMemberFromTrip = (memberId) => {
    updateTrip(currentTrip.id, { members: tripMembers.filter(m => m.id !== memberId) })
  }

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

        {/* Trip card — a real destination photo once one's set (see
            tripCardBackground in styles.js), the gradient/dot-texture
            treatment as a fallback before that. */}
        <div style={{
          ...tripCardBackground(currentTrip.destination ? CATEGORY_PHOTOS.destination : null),
          borderRadius: 18, padding: '24px 22px',
          marginBottom: SPACING.sectionGap,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 4px ${COLORS.teal}30, 0 16px 36px ${COLORS.teal}45`,
        }}>
          {!cardEditing ? (
            <>
              {/* A small, consistent spacing scale for the whole card
                  instead of ad-hoc margins: 4px within the identity block
                  (label/name/location) and again between the countdown
                  badge and the dates/budget line right after it, since
                  each of those pairs reads as one grouped unit; 8px for
                  the one "next section" transition (location into the
                  badge); 16px (2x the 8px unit) before Traveling With,
                  the one deliberate section break on the card. */}
              {/* Trip name — the primary heading of the card: largest and
                  boldest text here, with the edit icon for the whole card
                  next to it. Destination is a supporting detail below it,
                  not the other way around. */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4, textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>Current trip</p>
                  <h2 style={{ fontSize: 27, fontWeight: 800, color: 'white', letterSpacing: -0.6, lineHeight: 1.1, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>{currentTrip.name}</h2>
                </div>
                <button
                  onClick={openCardEdit}
                  aria-label="Edit trip details"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px', flexShrink: 0, lineHeight: 1, marginTop: 2,
                    width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0.8,
                  }}
                >
                  <PencilIcon color="rgba(255,255,255,0.75)" />
                </button>
              </div>

              {/* Destination — a supporting detail under the trip name, not
                  a second headline: noticeably smaller than the name above
                  it. */}
              {currentTrip.destination ? (
                <p style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.95)', letterSpacing: -0.2, lineHeight: 1.3, marginBottom: 8, textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>
                  📍 {currentTrip.destination}
                </p>
              ) : hasAnyTripDetails ? (
                <p style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', fontWeight: 500, marginBottom: 8 }}>
                  Destination not set yet
                </p>
              ) : (
                <button
                  onClick={openCardEdit}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left',
                  }}
                >
                  <PencilIcon size={12} color="rgba(255,255,255,0.65)" />
                  <span style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                    Tap to add destination, dates & budget
                  </span>
                </button>
              )}

              {/* Countdown — a real, computed "X days until departure" pill,
                  directly under the destination name. Turns milestone-green
                  once departure is a week out or closer, imminent or already
                  underway; otherwise a neutral glass pill. */}
              {currentTrip.destination && currentTrip.startDate && (() => {
                const days = daysUntil(currentTrip.startDate)
                const imminent = days <= 7
                return (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: imminent ? COLORS.milestone : 'rgba(255,255,255,0.16)',
                    borderRadius: 20, padding: '6px 12px', marginBottom: 4,
                  }}>
                    <span style={{ fontSize: 13 }}>🗓️</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>
                      {countdownLabel(days)}
                    </span>
                  </div>
                )
              })()}

              {/* Dates and budget — smaller still than the destination line,
                  a clear step down in the hierarchy, but solid white (not a
                  muted/transparent tone) once actually set so they stay
                  readable against the teal background; only the "not set
                  yet" placeholder state stays dimmed and italic. */}
              {hasAnyTripDetails && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: currentTrip.dates ? 'white' : 'rgba(255,255,255,0.55)', fontStyle: currentTrip.dates ? 'normal' : 'italic', textShadow: currentTrip.dates ? '0 1px 6px rgba(0,0,0,0.45)' : 'none' }}>
                    📅 {currentTrip.dates || 'Dates not set yet'}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: currentTrip.budget ? 'white' : 'rgba(255,255,255,0.55)', fontStyle: currentTrip.budget ? 'normal' : 'italic', textShadow: currentTrip.budget ? '0 1px 6px rgba(0,0,0,0.45)' : 'none' }}>
                    💰 {currentTrip.budget ? `Budget: ${currentTrip.budget}` : 'Budget not set yet'}
                  </p>
                </div>
              )}

              {/* Traveling with — its own labeled block, not names tacked
                  onto the bottom of the card as an afterthought. A compact
                  row of avatar circles (no name labels — the row itself is
                  the point, not each individual name) ending in a dashed
                  "+" button so inviting someone is a one-tap action right
                  here, not buried inside the full trip-edit panel. */}
              <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.16)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, textShadow: '0 1px 6px rgba(0,0,0,0.45)' }}>
                  Traveling with
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  {tripMembers.map(m => (
                    <div
                      key={m.id}
                      title={m.name}
                      style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: m.color,
                        border: '2px solid white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700, color: 'white', lineHeight: 1, flexShrink: 0,
                      }}
                    >
                      {m.initial}
                    </div>
                  ))}
                  <button
                    onClick={openCardEdit}
                    aria-label="Add a traveler"
                    style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      border: '2px dashed rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.10)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}
                  >
                    <PlusIcon size={16} color="white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                Trip name
              </p>
              <input
                autoFocus
                value={ceName}
                onChange={e => setCeName(e.target.value)}
                placeholder="Name your trip"
                style={{
                  width: '100%', height: 40, borderRadius: 10, border: 'none',
                  background: 'white', color: COLORS.charcoal, padding: '0 12px',
                  fontSize: 14, fontWeight: 600, fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 14,
                }}
              />

              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                Destination
              </p>
              <input
                value={ceDestination}
                onChange={e => setCeDestination(e.target.value)}
                placeholder="Where are you going?"
                style={{
                  width: '100%', height: 40, borderRadius: 10, border: 'none',
                  background: 'white', color: COLORS.charcoal, padding: '0 12px',
                  fontSize: 14, fontWeight: 600, fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 14,
                }}
              />

              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                Dates
              </p>
              {!ceDatesOpen ? (
                <button
                  onClick={() => setCeDatesOpen(true)}
                  style={{
                    width: '100%', height: 40, borderRadius: 10, border: 'none',
                    background: 'white', color: COLORS.charcoal, textAlign: 'left',
                    padding: '0 12px', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', marginBottom: 14,
                  }}
                >
                  {ceDateRange.start
                    ? (ceDateRange.end ? `${fmtDate(ceDateRange.start)} – ${fmtDate(ceDateRange.end)}` : fmtDate(ceDateRange.start))
                    : (currentTrip.dates || 'Choose dates')}
                </button>
              ) : (
                <div style={{ marginBottom: 14 }}>
                  <DateRangePicker
                    startDate={ceDateRange.start}
                    endDate={ceDateRange.end}
                    onChange={range => setCeDateRange(range)}
                    onDone={() => setCeDatesOpen(false)}
                  />
                </div>
              )}

              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                Budget
              </p>
              <input
                value={ceBudget}
                onChange={e => setCeBudget(e.target.value)}
                placeholder="Total budget…"
                style={{
                  width: '100%', height: 40, borderRadius: 10, border: 'none',
                  background: 'white', color: COLORS.charcoal, padding: '0 12px',
                  fontSize: 14, fontWeight: 600, fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 16,
                }}
              />

              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                Members
              </p>
              <div style={{ marginBottom: 14 }}>
                {tripMembers.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', lineHeight: 1, flexShrink: 0 }}>
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
                    style={{ height: 36, borderRadius: 8, border: 'none', background: 'white', color: COLORS.charcoal, padding: '0 10px', fontSize: 13, fontFamily: 'inherit' }}
                  />
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={e => setNewMemberEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addMemberToTrip()}
                    placeholder="Email (required)"
                    style={{ height: 36, borderRadius: 8, border: 'none', background: 'white', color: COLORS.charcoal, padding: '0 10px', fontSize: 13, fontFamily: 'inherit' }}
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
                    Add member
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={cancelCardEdit}
                  style={{
                    flex: 1, height: 40, borderRadius: 10, border: `1.5px solid rgba(255,255,255,0.3)`,
                    background: 'rgba(255,255,255,0.12)', color: 'white', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveCardEdit}
                  style={{
                    flex: 1, height: 40, borderRadius: 10, border: 'none',
                    background: 'white', color: COLORS.teal, fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Save changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Direct link into this trip's discussion thread — so users don't
            have to guess which thread in the global Discuss tab is theirs.
            Uses the trip's current name, not pinnedThread.title, which is
            frozen at trip-creation time and goes stale after a rename. */}
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
            <RowIconBadge>
              <ChatIcon active size={17} />
            </RowIconBadge>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.charcoal, letterSpacing: -0.2 }}>
                {currentTrip.name || 'My Trip'} discussion
              </p>
              <p style={{ fontSize: 12, color: COLORS.warmGrey, marginTop: 1 }}>
                Jump into your trip's conversation
              </p>
            </div>
            <span style={{ fontSize: 16, color: COLORS.subtleIcon }}>›</span>
          </button>
        )}

        {/* Quick access — four equal-sized cards in a fixed 2x2 grid, all
            matching in size/style (no single item spanning a full row).
            Trip Summary and Group Space are now plain link-out tiles;
            their previous full-width cards (with a longer description or
            a nested category-preview list) traded that detail for
            consistency here. Categories keeps the real progress ring —
            trip progress is the one number this whole app is building
            toward, so it still gets a real visual instead of plain text
            (design-refresh step 3: Trip Home richness) — and is simply
            omitted from the grid on the rare trip with no categories at
            all, rather than left as an empty tile. */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.cardGap, marginBottom: SPACING.cardGap }}>
          <QuickAccessTile
            badge={<RowIconBadge bg={COLORS.sand}><ClipboardIcon size={17} color={COLORS.terracotta} /></RowIconBadge>}
            title="Trip Summary"
            subtitle="View your trip overview"
            onClick={() => navigate('tripSummary')}
          />
          {visibleCategories.length > 0 && (
            <QuickAccessTile
              badge={
                <ProgressRing
                  decided={decidedCategoriesCount}
                  total={visibleCategories.length}
                  size={ROW_ICON_SIZE}
                  strokeWidth={3.5}
                  color={allCategoriesDecided ? COLORS.milestone : COLORS.action}
                  trackColor={allCategoriesDecided ? COLORS.milestoneTint : COLORS.borderLight}
                />
              }
              title="Categories"
              subtitle={allCategoriesDecided ? '🎉 All decided!' : progressMicrocopy(decidedCategoriesCount, visibleCategories.length)}
              onClick={() => navigate('groupSpace', { initialView: 'decided' })}
            />
          )}
          <QuickAccessTile
            badge={<RowIconBadge><span style={{ fontSize: 17, lineHeight: 1 }}>👥</span></RowIconBadge>}
            title="Group Space"
            subtitle="Collaborate and manage ideas"
            onClick={() => navigate('groupSpace')}
          />
          <QuickAccessTile
            badge={<RowIconBadge bg={COLORS.sand}><span style={{ fontSize: 17, lineHeight: 1 }}>💡</span></RowIconBadge>}
            title="My Ideas"
            subtitle="Private, only you can see these"
            onClick={() => navigate('myIdeasFull')}
          />
        </div>
      </div>
    </div>
  )
}
