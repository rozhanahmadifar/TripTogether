const SCATTER = [
  { icon: '✈️', top: '10%', left: '14%', size: 20, opacity: 0.14, rotate: -18 },
  { icon: '📍', top: '18%', left: '78%', size: 18, opacity: 0.12, rotate: 10 },
  { icon: '✨', top: '30%', left: '55%', size: 14, opacity: 0.16, rotate: 0 },
  { icon: '✨', top: '68%', left: '20%', size: 12, opacity: 0.14, rotate: 0 },
  { icon: '📍', top: '78%', left: '68%', size: 16, opacity: 0.1, rotate: -8 },
  { icon: '✈️', top: '58%', left: '85%', size: 16, opacity: 0.1, rotate: 24 },
  { icon: '✨', top: '12%', left: '40%', size: 10, opacity: 0.18, rotate: 0 },
]

export function WelcomeScreen({ navigate }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px',
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg, #1E5F5F 0%, #1A4E4E 45%, #163D3D 100%)',
    }}>
      {/* Subtle scattered decoration — like stars */}
      {SCATTER.map((s, i) => (
        <span key={i} style={{
          position: 'absolute', top: s.top, left: s.left,
          fontSize: s.size, opacity: s.opacity,
          transform: `rotate(${s.rotate}deg)`,
          filter: 'grayscale(1) brightness(3)',
          pointerEvents: 'none',
        }}>
          {s.icon}
        </span>
      ))}

      <div style={{ position: 'relative', width: 120, height: 110, marginBottom: 36 }}>
        <span style={{ fontSize: 56, position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>🌍</span>
        <span style={{ fontSize: 34, position: 'absolute', bottom: 0, left: 8 }}>✈️</span>
        <span style={{ fontSize: 30, position: 'absolute', bottom: 2, right: 8 }}>📍</span>
      </div>

      <h1 style={{
        fontSize: 38, fontWeight: 800, color: 'white',
        letterSpacing: 0.5, marginBottom: 12, textAlign: 'center',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}>
        TripTogether
      </h1>
      <p style={{
        fontSize: 15, color: 'rgba(255,255,255,0.65)',
        textAlign: 'center', lineHeight: 1.55, marginBottom: 64,
        fontWeight: 500, letterSpacing: 1,
      }}>
        Your ideas. Your people. One trip.
      </p>

      <button
        onClick={() => navigate('yourName')}
        style={{
          width: '100%', height: 56, background: 'white', color: '#1E5F5F',
          border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 600,
          cursor: 'pointer', letterSpacing: -0.2,
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        Get Started
      </button>
    </div>
  )
}
