import { TEXT, COLORS, SPACING } from '../styles'

export function MyTripsScreen({ navigate, trips, openTrip }) {
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
              onClick={() => navigate('createTrip')}
              style={{
                minHeight: SPACING.buttonMinHeight, background: COLORS.teal, color: 'white', border: 'none',
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
              <button
                key={trip.id}
                onClick={() => openTrip(trip.id)}
                style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left', background: 'none', padding: 0 }}
              >
                <div style={{
                  background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealLight} 100%)`,
                  borderRadius: 18, padding: '22px 20px',
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px ${COLORS.teal}40`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 5 }}>
                        Planning in progress
                      </p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: -0.4, lineHeight: 1.1 }}>
                        {trip.name || 'Unnamed Trip'}
                      </p>
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: 8, padding: '5px 12px',
                    }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>Active</span>
                    </div>
                  </div>

                  {(trip.destination || trip.dates) && (
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 16, fontWeight: 500 }}>
                      {trip.destination && `📍 ${trip.destination}`}
                      {trip.destination && trip.dates && '  ·  '}
                      {trip.dates && trip.dates}
                    </p>
                  )}

                  {trip.members && trip.members.length > 0 && (
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                      {trip.members.map(m => (
                        <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: m.color,
                            border: '2px solid white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700, color: 'white',
                          }}>
                            {m.initial}
                          </div>
                          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                            {m.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 16px',
                  }}>
                    <span style={{ fontSize: 12, color: 'white', fontWeight: 700 }}>Open trip</span>
                  </div>
                </div>
              </button>
            ))}

            <button
              onClick={() => navigate('createTrip')}
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
    </div>
  )
}
