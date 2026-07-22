import { useState } from 'react'
import { COLORS } from '../styles'

export function YourNameScreen({ navigate, setUserName }) {
  const [name, setName] = useState('')
  const [focused, setFocused] = useState(false)

  const handleGo = () => {
    if (!name.trim()) return
    setUserName(name.trim())
    navigate('individualHome')
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: COLORS.bgMyIdeas, padding: '48px 28px 40px',
    }}>
      {/* Name tag illustration */}
      <div style={{
        alignSelf: 'center', marginBottom: 44,
        background: 'white', borderRadius: 16, padding: '24px 52px 28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        position: 'relative', textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          width: 24, height: 24, borderRadius: '50%',
          background: COLORS.teal, border: `3px solid ${COLORS.bgMyIdeas}`,
        }} />
        <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 }}>
          Hello, I'm
        </p>
        <p style={{
          fontSize: 26, fontWeight: 800, color: name ? COLORS.charcoal : '#C8BEB0',
          letterSpacing: -0.5, minWidth: 100, transition: 'color 0.15s',
        }}>
          {name || 'Your name'}
        </p>
      </div>

      <h2 style={{
        fontSize: 26, fontWeight: 800, color: COLORS.charcoal,
        letterSpacing: -0.5, textAlign: 'center', marginBottom: 10,
      }}>
        What should we call you?
      </h2>
      <p style={{
        fontSize: 15, color: COLORS.warmGrey, textAlign: 'center',
        lineHeight: 1.55, marginBottom: 32, fontWeight: 500,
      }}>
        This is how your travel crew will see you.
      </p>

      <input
        autoFocus
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleGo()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Your name"
        style={{
          width: '100%', height: 56, borderRadius: 14,
          border: `2px solid ${focused ? COLORS.teal : COLORS.border}`,
          padding: '0 18px', fontSize: 18, color: COLORS.charcoal,
          background: 'white', fontFamily: 'inherit',
          boxShadow: focused ? `0 0 0 4px ${COLORS.teal}22` : 'none',
        }}
      />

      <div style={{ flex: 1 }} />

      <button
        onClick={handleGo}
        disabled={!name.trim()}
        style={{
          marginTop: 24, width: '100%', height: 56, borderRadius: 16,
          background: name.trim() ? COLORS.action : COLORS.border,
          color: name.trim() ? 'white' : '#A79E93',
          border: 'none', fontSize: 15, fontWeight: 600,
          cursor: name.trim() ? 'pointer' : 'default',
          letterSpacing: -0.2,
        }}
      >
        Let's Go
      </button>
    </div>
  )
}
