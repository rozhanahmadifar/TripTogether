import { WELCOME_PHOTO } from '../data'

// A real photo behind the welcome screen, not a flat gradient + decorative
// emoji doodles — the doodles were filling space a real photo now fills on
// its own, so they're gone rather than layered on top of it (a scattering
// of little icons over real photography reads as clutter, not polish).
// Content anchors to the bottom third, the same "photo up top, content
// sheet at the bottom" composition real travel-app splash screens use,
// rather than everything centered in the middle of the frame.
export function WelcomeScreen({ navigate }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-end',
      padding: '40px 28px 48px',
      position: 'relative', overflow: 'hidden',
      backgroundImage: [
        'linear-gradient(180deg, rgba(13,38,38,0.05) 0%, rgba(12,34,34,0.35) 55%, rgba(10,28,28,0.92) 88%, #0B1F1F 100%)',
        `url(${WELCOME_PHOTO})`,
      ].join(', '),
      backgroundSize: 'cover, cover',
      backgroundPosition: 'center, center 30%',
      backgroundRepeat: 'no-repeat, no-repeat',
      backgroundColor: '#163D3D',
    }}>
      <h1 style={{
        fontSize: 38, fontWeight: 800, color: 'white',
        letterSpacing: 0.5, marginBottom: 12, textAlign: 'center',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        textShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}>
        TripTogether
      </h1>
      <p style={{
        fontSize: 15, color: 'rgba(255,255,255,0.75)',
        textAlign: 'center', lineHeight: 1.55, marginBottom: 40,
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
          boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        Get Started
      </button>
    </div>
  )
}
