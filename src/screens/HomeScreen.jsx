import { members } from '../data'

export function HomeScreen({ navigate }) {
  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 12, color: '#B5A898', fontWeight: 500, letterSpacing: 0.2, marginBottom: 2 }}>Good afternoon ☀️</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1C1410', letterSpacing: -0.8, lineHeight: 1 }}>TripTogether</h1>
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: '#E8705A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: 'white', fontWeight: 700,
            boxShadow: '0 2px 8px rgba(232,112,90,0.4)',
          }}>
            Y
          </div>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: '16px 20px 32px' }}>
        {/* Group card */}
        <div style={{
          background: 'linear-gradient(140deg, #E8705A 0%, #c45840 100%)',
          borderRadius: 20,
          padding: '18px 20px 20px',
          marginBottom: 20,
          boxShadow: '0 8px 28px rgba(232,112,90,0.35)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 }}>Active trip</p>
              <p style={{ fontSize: 21, fontWeight: 800, color: 'white', letterSpacing: -0.4, lineHeight: 1 }}>🇮🇪 Ireland Trip</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 5 }}>September 2025 · 5 people</p>
            </div>
            <span style={{ fontSize: 26 }}>✈️</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {members.map(m => (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.22)',
                  border: '2px solid rgba(255,255,255,0.55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'white',
                }}>
                  {m.initial}
                </div>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section label */}
        <p style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Your spaces</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* My Saves */}
          <button
            onClick={() => navigate('mySaves')}
            className="card"
            style={{
              padding: '16px', border: 'none', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 14, width: '100%',
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: 'linear-gradient(140deg, #f5a88a, #E8705A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>🔖</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#1C1410', marginBottom: 2, letterSpacing: -0.2 }}>My Saves</p>
              <p style={{ fontSize: 12, color: '#B5A898' }}>13 items · Private</p>
            </div>
            <span style={{ color: '#D4C8BE', fontSize: 18, fontWeight: 300 }}>›</span>
          </button>

          {/* Group Space */}
          <button
            onClick={() => navigate('groupSpace')}
            className="card"
            style={{
              padding: '16px', border: 'none', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 14, width: '100%',
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: 'linear-gradient(140deg, #82C09A, #5aab73)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>🌍</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#1C1410', marginBottom: 2, letterSpacing: -0.2 }}>Group Space</p>
              <p style={{ fontSize: 12, color: '#B5A898' }}>44 items · Ireland Trip</p>
            </div>
            <span style={{ color: '#D4C8BE', fontSize: 18, fontWeight: 300 }}>›</span>
          </button>
        </div>

        {/* Quick actions */}
        <p style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, marginTop: 22 }}>Quick actions</p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('saveMoment')}
            style={{
              flex: 1,
              background: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '14px 12px',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.05)',
            }}
          >
            <span style={{ fontSize: 20, display: 'block', marginBottom: 6 }}>📸</span>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1C1410', lineHeight: 1.2 }}>Save something</p>
            <p style={{ fontSize: 11, color: '#B5A898', marginTop: 3 }}>Keep it or share it</p>
          </button>

          <button
            onClick={() => navigate('ai')}
            style={{
              flex: 1,
              background: 'linear-gradient(140deg, #3d3360, #5a4a8a)',
              border: 'none',
              borderRadius: 14,
              padding: '14px 12px',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: '0 4px 16px rgba(60,48,100,0.3)',
            }}
          >
            <span style={{ fontSize: 20, display: 'block', marginBottom: 6 }}>✨</span>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>Ask the AI</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>Trip ideas & advice</p>
          </button>
        </div>
      </div>
    </div>
  )
}
