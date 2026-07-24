import { useState } from 'react'
import { TEXT, COLORS, SPACING, tripCardBackground } from '../styles'
import { truncateName, daysUntil, countdownLabel } from '../data'
import { ActionMenu, TrashIcon } from '../components/ActionMenu'

export function MyTripsScreen({ navigate, trips, openTrip, deleteTrip }) {
  const [menuTrip, setMenuTrip]         = useState(null)
  const [deletingTrip, setDeletingTrip] = useState(null)

  const confirmDelete = () => { deleteTrip(deletingTrip.id); setDeletingTrip(null) }

  return (
    <div className="screen" style={{ background: COLORS.bg }}>
      <div style={{ padding: '20px 20px 16px', background: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
        <p style={{ ...TEXT.subtext, marginBottom: 3 }}>
          Trips you're part of
        </p>
        <h1 style={TEXT.screenTitle}>
          My Trips
        </h1>
      </div>

      <div className="screen-scroll" style={{ padding: `16px ${SPACING.screenX}px ${SPACING.scrollBottomPad}px` }}>
        {trips.length === 0 ? (
          <div style={{
            marginTop: SPACING.sectionGap, textAlign: 'center', padding: '48px 24px 28px',
            background: 'white', borderRadius: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{ position: 'relative', width: 100, height: 64, margin: '0 auto 20px' }}>
              <span style={{ fontSize: 44, position: 'absolute', left: 8, top: 0 }}>🧳</span>
              <span style={{ fontSize: 34, position: 'absolute', right: 4, bottom: 0 }}>✨</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: COLORS.charcoal, marginBottom: 8, letterSpacing: -0.3 }}>
              No trips yet
            </p>
            <p style={{ fontSize: 14, color: COLORS.warmGrey, lineHeight: 1.5, marginBottom: 28, fontWeight: 400, maxWidth: 240, marginLeft: 'auto', marginRight: 'auto' }}>
              Start planning with your crew.
            </p>
            <button
              onClick={() => navigate('createTrip', { backTo: 'myTrips' })}
              style={{
                minHeight: SPACING.buttonMinHeight, background: COLORS.action, color: 'white', border: 'none',
                borderRadius: 12, padding: '0 28px',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Create a Group Trip
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {trips.map(trip => (
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
                <div style={{
                  ...tripCardBackground(),
                  borderRadius: 18, padding: '22px 20px',
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px ${COLORS.teal}40`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 5 }}>
                        Planning in progress
                      </p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: -0.4, lineHeight: 1.1 }}>
                        {trip.name || 'Unnamed Trip'}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const rect = e.currentTarget.getBoundingClientRect()
                          setMenuTrip({ trip, anchor: { top: rect.top, left: rect.left, width: rect.width, height: rect.height } })
                        }}
                        aria-label="Trip options"
                        style={{
                          height: 30, border: 'none', background: 'rgba(255,255,255,0.18)', borderRadius: 8,
                          cursor: 'pointer', padding: '0 10px', fontSize: 17, color: 'white', lineHeight: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        ⋯
                      </button>
                    </div>
                  </div>

                  {/* Destination — same supporting-detail treatment as the
                      full trip header: smaller than the name, but its own
                      line rather than folded into the dates. */}
                  {trip.destination && (
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.92)', letterSpacing: -0.1, marginBottom: 6 }}>
                      📍 {trip.destination}
                    </p>
                  )}

                  {/* Countdown — same imminent-vs-neutral pill treatment as
                      trip home, so the same trip reads the same urgency in
                      both places. */}
                  {trip.startDate && (() => {
                    const days = daysUntil(trip.startDate)
                    const imminent = days <= 7
                    return (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: imminent ? COLORS.milestone : 'rgba(255,255,255,0.16)',
                        borderRadius: 20, padding: '4px 10px', marginBottom: 8,
                      }}>
                        <span style={{ fontSize: 11 }}>🗓️</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>
                          {countdownLabel(days)}
                        </span>
                      </div>
                    )
                  })()}

                  {trip.dates && (
                    <p style={{ fontSize: 13, color: 'white', fontWeight: 600, marginBottom: 16 }}>
                      📅 {trip.dates}
                    </p>
                  )}

                  {trip.members && trip.members.length > 0 && (
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.16)' }}>
                      {trip.members.map(m => (
                        <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: m.color,
                            border: '2px solid white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, color: 'white',
                          }}>
                            {m.initial}
                          </div>
                          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }} title={m.name}>
                            {truncateName(m.name)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

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
