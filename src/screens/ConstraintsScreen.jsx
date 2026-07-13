import { useState } from 'react'
import { members } from '../data'
import { BackButton } from '../components/BackButton'

const WEATHER_OPTIONS = ['Warm', 'Mild', 'Cool', 'Any']
const WEATHER_ICONS   = { Warm: '☀️', Mild: '🌤️', Cool: '🌧️', Any: '🌍' }

const VISITED_DEFAULTS = {
  1: 'France, Spain',
  2: 'Germany, Italy',
  3: 'Portugal',
  4: 'Ireland',
  5: 'Netherlands, Belgium',
}

export function ConstraintsScreen({ navigate }) {
  const [minBudget, setMinBudget] = useState(200)
  const [maxBudget, setMaxBudget] = useState(500)
  const [visas, setVisas]         = useState({ 1: 'Schengen', 2: 'Schengen', 3: 'Any', 4: 'Schengen', 5: 'Any' })
  const [weather, setWeather]     = useState('Mild')
  const [visited, setVisited]     = useState(VISITED_DEFAULTS)

  const toggleVisa = (id) =>
    setVisas(prev => ({ ...prev, [id]: prev[id] === 'Schengen' ? 'Any' : 'Schengen' }))

  return (
    <div className="screen">
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => navigate('groupHome')} />
        <div>
          <p style={{ fontWeight: 800, fontSize: 19, color: '#1C1410', letterSpacing: -0.5 }}>
            Trip Constraints
          </p>
          <p style={{ fontSize: 12, color: '#B5A898', marginTop: 1 }}>What works for everyone</p>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: '4px 20px 40px' }}>
        {/* Budget */}
        <div className="card" style={{ padding: '16px', marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 }}>
            Budget per person
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#E8705A', letterSpacing: -1 }}>
              €{minBudget}–€{maxBudget}
            </span>
            <span style={{ fontSize: 12, color: '#B5A898' }}>per person</span>
          </div>

          <p style={{ fontSize: 11, color: '#B5A898', marginBottom: 6 }}>Minimum  (€{minBudget})</p>
          <input
            type="range" min={50} max={1000} step={50}
            value={minBudget}
            onChange={e => setMinBudget(Math.min(Number(e.target.value), maxBudget - 50))}
            style={{ width: '100%', accentColor: '#E8705A', marginBottom: 16 }}
          />
          <p style={{ fontSize: 11, color: '#B5A898', marginBottom: 6 }}>Maximum  (€{maxBudget})</p>
          <input
            type="range" min={100} max={2000} step={50}
            value={maxBudget}
            onChange={e => setMaxBudget(Math.max(Number(e.target.value), minBudget + 50))}
            style={{ width: '100%', accentColor: '#E8705A' }}
          />
        </div>

        {/* Visa */}
        <div className="card" style={{ padding: '16px', marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 }}>
            Visa requirements
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {members.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: m.color, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'white',
                }}>
                  {m.initial}
                </div>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#1C1410', flex: 1 }}>{m.name}</p>
                <button
                  onClick={() => toggleVisa(m.id)}
                  style={{
                    borderRadius: 20, padding: '5px 14px', cursor: 'pointer', border: 'none',
                    fontSize: 12, fontWeight: 700,
                    background: visas[m.id] === 'Schengen' ? '#EEF5FC' : '#F0FAF4',
                    color:      visas[m.id] === 'Schengen' ? '#2E7DB5' : '#3a8a58',
                  }}
                >
                  {visas[m.id]}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="card" style={{ padding: '16px', marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 }}>
            Weather preference
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {WEATHER_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setWeather(opt)}
                style={{
                  borderRadius: 20, padding: '7px 16px', cursor: 'pointer',
                  border: `1.5px solid ${weather === opt ? '#E8705A' : '#EDE7E0'}`,
                  fontSize: 13, fontWeight: 700,
                  background: weather === opt ? '#FEF4F1' : '#fff',
                  color:      weather === opt ? '#E8705A' : '#8A7A6A',
                }}
              >
                {WEATHER_ICONS[opt]} {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Places visited */}
        <div className="card" style={{ padding: '16px', marginBottom: 22 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 }}>
            Places already visited
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {members.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: m.color, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'white', marginTop: 2,
                }}>
                  {m.initial}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, color: '#1C1410', marginBottom: 4 }}>{m.name}</p>
                  <input
                    value={visited[m.id] || ''}
                    onChange={e => setVisited(prev => ({ ...prev, [m.id]: e.target.value }))}
                    placeholder="Countries visited…"
                    style={{
                      width: '100%', border: '1px solid #EDE7E0', borderRadius: 8,
                      padding: '6px 10px', fontSize: 12, color: '#5a4a3a',
                      fontFamily: 'inherit', background: '#F7F3EF',
                      boxSizing: 'border-box', outline: 'none',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate('groupHome')}
          style={{
            width: '100%', height: 50, background: '#E8705A', color: 'white',
            border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 15,
            cursor: 'pointer',
            letterSpacing: -0.2,
          }}
        >
          Save Constraints
        </button>
      </div>
    </div>
  )
}
