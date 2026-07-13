import { useState } from 'react'
import { mySavesCategories } from '../data'

export function BringIdeasScreen({ navigate }) {
  const [added, setAdded] = useState(new Set())

  const addCategory = (id) => {
    setAdded(prev => new Set([...prev, id]))
  }

  return (
    <div className="screen">
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, paddingRight: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#82C09A', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
              You're in the group! 🎉
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#1C1410', letterSpacing: -0.6, lineHeight: 1.25, marginBottom: 6 }}>
              Bring your ideas to the trip?
            </p>
            <p style={{ fontSize: 13, color: '#8A7A6A', lineHeight: 1.4 }}>
              You saved these privately. Share any with the group.
            </p>
          </div>
          <button
            onClick={() => navigate('groupHome')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: '#B5A898', fontWeight: 600, paddingTop: 2, flexShrink: 0,
            }}
          >
            Skip
          </button>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: '20px 20px 36px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mySavesCategories.map(cat => {
            const isAdded = added.has(cat.id)
            return (
              <div key={cat.id} className="card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 22, width: 30, flexShrink: 0 }}>{cat.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 15, color: '#1C1410', letterSpacing: -0.2, marginBottom: 2 }}>
                      {cat.label}
                    </p>
                    <p style={{ fontSize: 12, color: '#B5A898' }}>
                      {cat.count} {cat.count === 1 ? 'item' : 'items'} saved
                    </p>
                  </div>
                  <button
                    onClick={() => !isAdded && addCategory(cat.id)}
                    style={{
                      height: 34, borderRadius: 10, border: 'none',
                      cursor: isAdded ? 'default' : 'pointer',
                      padding: '0 14px', fontSize: 12, fontWeight: 700,
                      background: isAdded ? '#F0FAF4' : '#E8705A',
                      color: isAdded ? '#3a8a58' : 'white',
                      flexShrink: 0,
                    }}
                  >
                    {isAdded ? '✓ Added' : 'Add'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => navigate('groupHome')}
          style={{
            marginTop: 22, width: '100%', height: 50,
            background: '#E8705A', color: 'white', border: 'none',
            borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer',
            letterSpacing: -0.2,
          }}
        >
          Go to Group Space
        </button>

        <button
          onClick={() => navigate('groupHome')}
          style={{
            marginTop: 10, width: '100%', height: 38,
            background: 'transparent', border: 'none',
            cursor: 'pointer', fontSize: 13, color: '#B5A898', fontWeight: 500,
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
