import { useState } from 'react'

/* ─── Screen A: Welcome ─── */
function WelcomeScreen({ onNext }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(160deg, #A82C12 0%, #D85A38 38%, #E8855A 68%, #F5C060 100%)',
      paddingTop: 44, overflow: 'hidden', position: 'relative',
    }}>
      <span style={{ position: 'absolute', top: 68, left: 24, fontSize: 20, opacity: 0.18, transform: 'rotate(-22deg)' }}>✈️</span>
      <span style={{ position: 'absolute', top: 90, right: 28, fontSize: 15, opacity: 0.15 }}>📍</span>
      <span style={{ position: 'absolute', top: 140, left: 14, fontSize: 13, opacity: 0.12 }}>🗺️</span>
      <span style={{ position: 'absolute', top: 180, right: 18, fontSize: 17, opacity: 0.14, transform: 'rotate(12deg)' }}>✈️</span>
      <span style={{ position: 'absolute', bottom: 240, right: 22, fontSize: 16, opacity: 0.16 }}>📍</span>
      <span style={{ position: 'absolute', bottom: 280, left: 18, fontSize: 14, opacity: 0.13, transform: 'rotate(-8deg)' }}>🗺️</span>
      <span style={{ position: 'absolute', bottom: 180, right: 30, fontSize: 13, opacity: 0.12 }}>🛂</span>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', zIndex: 1 }}>
        <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 32 }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            transform: 'translate(-50%, -50%)',
          }} />
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 70, lineHeight: 1 }}>🌍</span>
          <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 30 }}>✈️</span>
          <span style={{ position: 'absolute', bottom: 12, left: 14, fontSize: 26 }}>📍</span>
          <span style={{ position: 'absolute', bottom: 6, right: 14, fontSize: 26 }}>👥</span>
        </div>

        <p style={{ fontSize: 38, fontWeight: 900, color: 'white', letterSpacing: -1.2, lineHeight: 1, marginBottom: 14, textShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
          TripTogether
        </p>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.82)', fontWeight: 400, letterSpacing: 0.2, textAlign: 'center', lineHeight: 1.6 }}>
          Your travel ideas.{' '}Your people.{'\n'}One trip.
        </p>
      </div>

      <div style={{ padding: '0 24px 48px', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
          {['✈️', '🗺️', '📍', '🛂', '👥'].map((e, i) => (
            <span key={i} style={{ fontSize: 13, opacity: 0.5 }}>{e}</span>
          ))}
        </div>
        <button
          onClick={onNext}
          style={{
            width: '100%', height: 56, background: 'rgba(255,255,255,0.96)',
            border: 'none', borderRadius: 18, cursor: 'pointer',
            fontSize: 17, fontWeight: 800, color: '#C04A28', letterSpacing: -0.3,
            boxShadow: '0 8px 28px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

/* ─── Screen B: Profile ─── */
function ProfileScreen({ onComplete }) {
  const [name, setName] = useState('')

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#FDF8F2', paddingTop: 44,
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px' }}>
        {/* Decorative name tag graphic */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-block', background: 'white',
            borderRadius: 16, padding: '18px 32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            border: '1.5px solid #EDE7E0',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>
              Hello, my name is
            </p>
            <div style={{ width: 80, height: 3, background: 'linear-gradient(90deg, #E8705A, #f5a88a)', borderRadius: 2 }} />
          </div>
        </div>

        <p style={{ fontSize: 26, fontWeight: 800, color: '#1C1410', letterSpacing: -0.8, lineHeight: 1.25, marginBottom: 8 }}>
          What should we call you?
        </p>
        <p style={{ fontSize: 14, color: '#B5A898', marginBottom: 24, lineHeight: 1.4 }}>
          This is how your travel crew will see you.
        </p>

        <div style={{
          background: 'white',
          borderRadius: 16,
          border: `2px solid ${name ? '#E8705A' : '#EDE7E0'}`,
          padding: '16px 20px',
          marginBottom: 28,
          boxShadow: name ? '0 4px 16px rgba(232,112,90,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'all 0.15s ease',
        }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim() && onComplete(name.trim())}
            placeholder="Your name…"
            autoFocus
            style={{
              width: '100%', border: 'none', background: 'none',
              fontSize: 22, fontWeight: 700, color: '#1C1410',
              fontFamily: 'inherit', letterSpacing: -0.4, outline: 'none',
            }}
          />
        </div>

        <button
          onClick={() => name.trim() && onComplete(name.trim())}
          disabled={!name.trim()}
          style={{
            width: '100%', height: 54,
            background: name.trim() ? '#E8705A' : '#EDE7E0',
            color: name.trim() ? 'white' : '#B5A898',
            border: 'none', borderRadius: 16, fontWeight: 800, fontSize: 17,
            cursor: name.trim() ? 'pointer' : 'default', letterSpacing: -0.3,
          }}
        >
          Let's Go
        </button>
      </div>
    </div>
  )
}

export function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {step === 0 && <WelcomeScreen onNext={() => setStep(1)} />}
      {step === 1 && <ProfileScreen onComplete={onComplete} />}
    </div>
  )
}
