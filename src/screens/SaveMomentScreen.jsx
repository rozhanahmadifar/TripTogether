import { useState } from 'react'
import { ItemImage } from '../components/ItemImage'
import { categories, members } from '../data'
import { BackButton } from '../components/BackButton'

const DEMO_TITLE = 'Cliffs of Moher at golden hour'

function ItemPreview({ compact }) {
  return (
    <div className="card" style={{ marginBottom: compact ? 16 : 24 }}>
      <ItemImage type="cliff" height={compact ? 90 : 160} />
      <div style={{ padding: compact ? '11px 14px' : '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: compact ? 5 : 8 }}>
          <span className="platform-badge" style={{ background: '#000' }}>TikTok</span>
          <span style={{ fontSize: 11, color: '#B5A898' }}>@irelandtravel.ie</span>
        </div>
        <p style={{ fontWeight: 700, fontSize: compact ? 13 : 15, color: '#1C1410', lineHeight: 1.35, letterSpacing: -0.2 }}>
          {DEMO_TITLE}
        </p>
        {!compact && (
          <p style={{ fontSize: 12, color: '#8A7A6A', marginTop: 5, lineHeight: 1.4 }}>
            The views at sunset are absolutely breathtaking.
          </p>
        )}
      </div>
    </div>
  )
}

function ConfirmationScreen({ destination, selectedCategory, navigate }) {
  const cat = categories.find(c => c.id === selectedCategory)
  const isGroup = destination === 'group'

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="screen-scroll" style={{ flex: 1, padding: '24px 20px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Success icon */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: isGroup
            ? 'linear-gradient(140deg, #82C09A, #5aab73)'
            : 'linear-gradient(140deg, #f5a88a, #E8705A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, marginBottom: 20,
          boxShadow: isGroup
            ? '0 8px 28px rgba(90,171,115,0.35)'
            : '0 8px 28px rgba(232,112,90,0.35)',
        }}>
          ✓
        </div>

        {/* Title */}
        <p style={{ fontSize: 22, fontWeight: 800, color: '#1C1410', letterSpacing: -0.6, marginBottom: 6, textAlign: 'center', lineHeight: 1.2 }}>
          {isGroup ? 'Added to Group Space' : 'Saved privately'}
        </p>

        {/* Category badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: isGroup ? '#F0FAF4' : '#FEF4F1',
          border: `1.5px solid ${isGroup ? '#82C09A' : '#E8B4A0'}`,
          borderRadius: 20, padding: '6px 14px', marginBottom: 20,
        }}>
          <span style={{ fontSize: 14 }}>{cat?.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: isGroup ? '#3a8a58' : '#C05A40' }}>
            {isGroup ? 'Group Space' : 'My Saves'}: {cat?.label}
          </span>
        </div>

        {/* Item card (compact) */}
        <div className="card" style={{ width: '100%', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            <div style={{ flexShrink: 0, width: 72 }}>
              <ItemImage type="cliff" height={72} />
            </div>
            <div style={{ padding: '10px 14px', flex: 1, minWidth: 0 }}>
              <span className="platform-badge" style={{ background: '#000', marginBottom: 5, display: 'inline-block' }}>TikTok</span>
              <p style={{ fontWeight: 700, fontSize: 13, color: '#1C1410', lineHeight: 1.3 }}>{DEMO_TITLE}</p>
            </div>
          </div>
        </div>

        {/* Group members OR private message */}
        {isGroup ? (
          <div className="card" style={{ width: '100%', padding: '14px 16px', marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>
              Your group will see this
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {members.map(m => (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: m.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: 'white',
                    boxShadow: `0 2px 8px ${m.color}55`,
                  }}>
                    {m.initial}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: '#8A7A6A' }}>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card" style={{ width: '100%', padding: '14px 16px', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, marginTop: 1 }}>🔒</span>
              <p style={{ fontSize: 13, color: '#8A7A6A', lineHeight: 1.5 }}>
                Only you can see this. You can share it with the group whenever you're ready.
              </p>
            </div>
          </div>
        )}

        {/* Primary CTA */}
        <button
          onClick={() => navigate(isGroup ? 'groupCategory' : 'mySavesCategory', { categoryId: selectedCategory })}
          style={{
            width: '100%', height: 50, background: '#E8705A', color: 'white',
            border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 15,
            cursor: 'pointer', marginBottom: 10,
            letterSpacing: -0.2,
          }}
        >
          {isGroup ? `Go to Group Space: ${cat?.label}` : `View in My Saves`}
        </button>

        <button
          onClick={() => navigate('saveMoment')}
          style={{
            width: '100%', height: 40, background: 'transparent', border: 'none',
            cursor: 'pointer', fontSize: 13, color: '#B5A898', fontWeight: 500,
          }}
        >
          Save something else
        </button>
      </div>
    </div>
  )
}

export function SaveMomentScreen({ navigate, params = {} }) {
  const preselected = params.destination
  const [step, setStep] = useState(preselected ? 2 : 1)
  const [destination, setDestination] = useState(preselected || null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [saved, setSaved] = useState(false)

  const chooseDestination = (dest) => {
    setDestination(dest)
    setStep(2)
  }

  const confirmSave = () => {
    if (!selectedCategory) return
    setSaved(true)
  }

  const back = () => {
    if (step === 2 && !preselected) { setStep(1); setSelectedCategory(null) }
    else navigate('home')
  }

  if (saved) {
    return <ConfirmationScreen destination={destination} selectedCategory={selectedCategory} navigate={navigate} />
  }

  return (
    <div className="screen">
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={back} />
        <div>
          <p style={{ fontWeight: 700, fontSize: 17, color: '#1C1410', letterSpacing: -0.3 }}>
            {step === 1 ? 'Save this' : 'Pick a category'}
          </p>
          <p style={{ fontSize: 11, color: '#B5A898', marginTop: 1 }}>Step {step} of 2</p>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: '0 20px 32px' }}>
        <ItemPreview compact={step === 2} />

        {step === 1 && (
          <>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1C1410', marginBottom: 4, letterSpacing: -0.3 }}>
              Keep this to yourself, or share it?
            </p>
            <p style={{ fontSize: 13, color: '#8A7A6A', marginBottom: 20, lineHeight: 1.4 }}>
              You can always share it later from My Saves.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => chooseDestination('private')}
                className="card"
                style={{ padding: '16px', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, background: 'linear-gradient(140deg, #f5a88a, #E8705A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔖</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: '#1C1410', marginBottom: 2 }}>Keep private</p>
                  <p style={{ fontSize: 12, color: '#B5A898' }}>Goes to My Saves, only you can see it</p>
                </div>
              </button>

              <button
                onClick={() => chooseDestination('group')}
                style={{ padding: '16px', borderRadius: 16, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, width: '100%', background: '#FEF4F1', border: '2px solid #E8705A' }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, background: 'linear-gradient(140deg, #82C09A, #5aab73)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🌍</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: '#1C1410', marginBottom: 2 }}>Add to Group Space</p>
                  <p style={{ fontSize: 12, color: '#8A7A6A' }}>Sara, Mia, Lena, Tom & Neda will see this</p>
                </div>
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1C1410', marginBottom: 3, letterSpacing: -0.3 }}>
              Where does this belong?
            </p>
            <p style={{ fontSize: 13, color: '#8A7A6A', marginBottom: 18, lineHeight: 1.4 }}>
              Saving to{' '}
              <strong style={{ color: destination === 'group' ? '#5aab73' : '#E8705A' }}>
                {destination === 'group' ? 'Group Space' : 'My Saves'}
              </strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {categories.map(cat => {
                const selected = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '13px 16px', borderRadius: 14, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 14, width: '100%', border: 'none',
                      background: selected ? '#FEF4F1' : '#fff',
                      outline: selected ? '2px solid #E8705A' : '2px solid transparent',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{cat.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#1C1410', flex: 1, textAlign: 'left' }}>{cat.label}</span>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      border: `2px solid ${selected ? '#E8705A' : '#DDD6CE'}`,
                      background: selected ? '#E8705A' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.12s ease',
                    }}>
                      {selected && <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>✓</span>}
                    </div>
                  </button>
                )
              })}
            </div>

            <button
              onClick={confirmSave}
              disabled={!selectedCategory}
              style={{
                width: '100%', height: 48, borderRadius: 14, border: 'none',
                background: selectedCategory ? '#E8705A' : '#EDE7E0',
                color: selectedCategory ? 'white' : '#B5A898',
                fontSize: 15, fontWeight: 700, cursor: selectedCategory ? 'pointer' : 'default',
                letterSpacing: -0.2,
              }}
            >
              {selectedCategory ? 'Save now' : 'Choose a category above'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
