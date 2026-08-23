import { useState } from 'react'
import { TEXT, COLORS, SPACING, SHADOW_SOFT } from '../styles'
import { daysUntil, countdownLabel, CATEGORY_PHOTOS } from '../data'
import { ActionMenu, TrashIcon } from '../components/ActionMenu'
import { TripsEmptyIllustration } from '../components/Illustrations'

function PeopleIcon({ size = 16, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14.2c2.4.5 4.5 2.6 4.5 5.8" />
    </svg>
  )
}

// A compact overlapping avatar row (no name labels, "+N" overflow badge)
// instead of the old full labeled stack — matches the reference's denser,
// list-row-appropriate avatar treatment. Kept local to this file since
// it's the only screen using this particular compact variant right now.
function CompactAvatars({ members, max = 3 }) {
  if (!members || members.length === 0) return null
  const shown = members.slice(0, max)
  const overflow = members.length - shown.length
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((m, i) => (
        <div key={m.id} title={m.name} style={{
          width: 28, height: 28, borderRadius: '50%', background: m.color,
          border: '2px solid white', marginLeft: i > 0 ? -8 : 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: 'white', lineHeight: 1, flexShrink: 0,
        }}>
          {m.initial}
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
          border: '2px solid white', marginLeft: -8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: 'white', lineHeight: 1, flexShrink: 0,
        }}>
          +{overflow}
        </div>
      )}
    </div>
  )
}

export function MyTripsScreen({ navigate, trips, openTrip, deleteTrip, allGroupItems = [], allCategories = [] }) {
  const [menuTrip, setMenuTrip]         = useState(null)
  const [deletingTrip, setDeletingTrip] = useState(null)

  const confirmDelete = () => { deleteTrip(deletingTrip.id); setDeletingTrip(null) }

  // Same "decided categories" metric Home's trip card and GroupHomeScreen
  // both already use — computed per-trip here since this list shows every
  // trip at once, not just the current one. Returns the raw decided/total
  // counts too (not just the percent) since the card now shows both
  // ("2 of 5 categories decided"), matching the phrasing GroupHomeScreen
  // and GroupSpaceScreen already use.
  const planningStats = (trip) => {
    const tripItems = allGroupItems.filter(i => i.tripId === trip.id)
    const visibleCategories = allCategories.filter(c => !c.hidden && !(c.id === 'destination' && trip.destinationSetAtCreation))
    if (visibleCategories.length === 0) return null
    const decided = visibleCategories.filter(cat =>
      tripItems.some(i => i.categoryIds.includes(cat.id) && (i.starredBy || []).length > 0)
    ).length
    return { decided, total: visibleCategories.length, percent: Math.round((decided / visibleCategories.length) * 100) }
  }

  return (
    <div className="screen" style={{ background: COLORS.bg }}>
      <div style={{ padding: '20px 20px 16px', background: 'white' }}>
        <h1 style={{ ...TEXT.screenTitle, marginBottom: SPACING.headingGap }}>
          My Trips
        </h1>
        <p style={TEXT.subtext}>
          Trips you're planning with your crew
        </p>
      </div>

      <div className="screen-scroll" style={{ padding: `16px ${SPACING.screenX}px ${SPACING.scrollBottomPad}px` }}>
        {trips.length === 0 ? (
          <div style={{
            marginTop: SPACING.sectionGap, textAlign: 'center', padding: '48px 24px 28px',
            background: 'white', borderRadius: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <TripsEmptyIllustration size={168} />
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: COLORS.charcoal, marginBottom: 8, letterSpacing: -0.3 }}>
              No trips yet
            </p>
            <p style={{ fontSize: 14, color: COLORS.warmGrey, lineHeight: 1.5, marginBottom: 28, fontWeight: 400, maxWidth: 240, marginLeft: 'auto', marginRight: 'auto' }}>
              Start planning your next adventure with your crew.
            </p>
            <button
              onClick={() => navigate('createTrip', { backTo: 'myTrips' })}
              style={{
                minHeight: SPACING.buttonMinHeight, background: COLORS.action, color: 'white', border: 'none',
                borderRadius: 12, padding: '0 28px',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <PeopleIcon />
              Create a Group Trip
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {trips.map(trip => {
              const stats = planningStats(trip)
              return (
                // A plain div acting as the "open trip" button, not a real
                // <button> — its own "⋯" trip-options control has to be a
                // real button too, and a button can't contain another button
                // (invalid HTML, breaks hydration). Same pattern as ItemCard.
                <div
                  key={trip.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openTrip(trip.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTrip(trip.id) } }}
                  style={{ width: '100%', cursor: 'pointer', textAlign: 'left' }}
                >
                  {/* A white row card with a destination thumbnail — matches
                      the Home screen's "Your trip" card language (same
                      recipe: eyebrow-free header, real photo, teal progress
                      bar) instead of the old full-bleed photo hero, so a
                      trip reads the same way whether it's the one current
                      trip on Home or one of several here. Wide and stretched
                      to the full text-column height (not a small fixed
                      square) so it reads as a real photo, not an icon. */}
                  <div style={{
                    background: COLORS.cardBg, border: `1px solid ${COLORS.borderLight}`,
                    borderRadius: 20, padding: 18, boxShadow: SHADOW_SOFT,
                  }}>
                    {/* Fixed size, top-aligned with the title — a bit
                        taller than the text column's own natural height so
                        it visibly extends past the members row, matching
                        the reference exactly (not stretched to match the
                        column exactly, and not a small square). */}
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      {trip.destination && (
                        <img
                          src={CATEGORY_PHOTOS.destination}
                          alt=""
                          style={{ width: 118, height: 160, borderRadius: 18, objectFit: 'cover', flexShrink: 0 }}
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                          <p style={{
                            fontSize: 18, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.3, lineHeight: 1.2,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {trip.name || 'Unnamed Trip'}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const rect = e.currentTarget.getBoundingClientRect()
                              setMenuTrip({ trip, anchor: { top: rect.top, left: rect.left, width: rect.width, height: rect.height } })
                            }}
                            aria-label="Trip options"
                            style={{
                              width: 26, height: 26, border: 'none', background: COLORS.borderLight, borderRadius: 8,
                              cursor: 'pointer', fontSize: 15, color: COLORS.warmGrey, lineHeight: 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}
                          >
                            ⋯
                          </button>
                        </div>

                        {trip.destination && (
                          <p style={{ fontSize: 13, fontWeight: 500, color: COLORS.warmGrey, marginBottom: 6 }}>
                            📍 {trip.destination}
                          </p>
                        )}

                        {/* Countdown — imminent trips (departing within a
                            week, or already underway) get a solid green
                            pill with a plane mark; everything further out
                            stays a neutral sand/terracotta pill. Same
                            urgency threshold as before, just recolored for
                            a white card instead of a photo background. */}
                        {trip.startDate && (() => {
                          const days = daysUntil(trip.startDate)
                          const imminent = days <= 7
                          return (
                            <div style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              background: imminent ? COLORS.milestoneTint : COLORS.sand,
                              borderRadius: 20, padding: '4px 10px', marginBottom: 8, marginLeft: -4,
                              flexShrink: 0,
                            }}>
                              <span style={{ fontSize: 11 }}>{days <= 0 ? '✈️' : '📅'}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: imminent ? COLORS.milestone : COLORS.terracotta, whiteSpace: 'nowrap' }}>
                                {countdownLabel(days)}
                              </span>
                            </div>
                          )
                        })()}

                        {trip.dates && (
                          <p style={{ fontSize: 13, color: COLORS.warmGrey, fontWeight: 500, marginBottom: trip.members?.length ? 10 : 0 }}>
                            📅 {trip.dates}
                          </p>
                        )}

                        {trip.members && trip.members.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <CompactAvatars members={trip.members} />
                            <span style={{ fontSize: 13, color: COLORS.warmGrey, fontWeight: 500 }}>
                              {trip.members.length} {trip.members.length === 1 ? 'member' : 'members'}
                            </span>
                          </div>
                        )}

                      </div>
                    </div>

                    {/* Planning progress — a full-width section below a
                        clear divider, separate from the photo/text row
                        above it entirely (not mixed in alongside the
                        photo, not a pill) — "X of Y categories decided"
                        text with the percentage opposite it, then the bar
                        underneath. Matches the reference's structure
                        exactly: main info block (photo + text) on top,
                        divider, progress info below. */}
                    {stats && (
                      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COLORS.borderLight}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: 13, color: COLORS.warmGrey, fontWeight: 500 }}>
                            {stats.decided} of {stats.total} {stats.total === 1 ? 'category' : 'categories'} decided
                          </span>
                          <span style={{ fontSize: 13, color: COLORS.warmGrey, fontWeight: 500 }}>{stats.percent}%</span>
                        </div>
                        <div style={{ height: 6, background: COLORS.borderLight, borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ width: `${stats.percent}%`, height: '100%', background: COLORS.milestone, borderRadius: 999 }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            <button
              onClick={() => navigate('createTrip', { backTo: 'myTrips' })}
              style={{
                width: '100%', height: 52, background: 'white',
                border: `1.5px solid ${COLORS.border}`, borderRadius: 14,
                fontWeight: 600, fontSize: 15, color: COLORS.charcoal,
                cursor: 'pointer',
                letterSpacing: -0.2,
              }}
            >
              + Start a New Trip
            </button>
          </div>
        )}
      </div>

      {menuTrip && (
        <ActionMenu
          anchorRect={menuTrip.anchor}
          onClose={() => setMenuTrip(null)}
          rows={[
            { icon: <TrashIcon />, label: 'Delete trip', color: COLORS.danger, onClick: () => { setDeletingTrip(menuTrip.trip); setMenuTrip(null) } },
          ]}
        />
      )}

      {deletingTrip && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
          }}
          onClick={e => { if (e.target === e.currentTarget) setDeletingTrip(null) }}
        >
          <div style={{
            background: 'white', borderRadius: 16, padding: 20, width: '100%', maxWidth: 280,
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)', textAlign: 'center',
          }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal, marginBottom: 8, lineHeight: 1.4 }}>
              Delete "{deletingTrip.name || 'Unnamed Trip'}"?
            </p>
            <p style={{ fontSize: 13, color: COLORS.warmGrey, marginBottom: 18, lineHeight: 1.4 }}>
              This permanently deletes the trip along with everything saved to it — group items and the discussion. This can't be undone. Your private My Ideas are never affected.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDeletingTrip(null)}
                style={{
                  flex: 1, minHeight: 40, borderRadius: 10, border: 'none',
                  background: COLORS.borderLight, color: COLORS.warmGrey,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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
