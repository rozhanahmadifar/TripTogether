import { useState } from 'react'
import { PLATFORM_COLORS, timeAgo } from '../data'
import { TEXT, COLORS, SPACING } from '../styles'
import { BackButton } from '../components/BackButton'

export function ItemDetailScreen({ navigate, params = {}, myIdeas, currentTrip, addToGroup, allCategories }) {
  const [showPicker, setShowPicker]         = useState(false)
  const [pickedCategory, setPickedCategory] = useState('')

  const { itemId, categoryId, backTo = 'myIdeasCategory' } = params
  const items = myIdeas[categoryId] || []
  const item  = items.find(i => i.id === itemId)
  const cat   = allCategories.find(c => c.id === categoryId) || allCategories[0] || { id: '', icon: '✨', label: 'Ideas', color: COLORS.teal }

  const handleBack = () => navigate(backTo, { categoryId, backTo: params.parentBackTo })

  const handleConfirmShare = () => {
    if (!pickedCategory) return
    addToGroup({ title: item.title, platform: item.platform, categoryId: pickedCategory })
    navigate('shareSuccess', { categoryId: pickedCategory })
  }

  if (!item) {
    return (
      <div className="screen" style={{ background: 'white' }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackButton onClick={handleBack} />
        </div>
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <p style={{ color: COLORS.warmGrey }}>Item not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="screen" style={{ background: 'white' }}>
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${COLORS.border}` }}>
        <BackButton onClick={handleBack} />
        <p style={{ fontSize: 19, fontWeight: 800, color: COLORS.teal, letterSpacing: -0.4 }}>
          {cat.icon} {cat.label}
        </p>
      </div>

      <div className="screen-scroll" style={{ padding: `20px ${SPACING.screenX}px 40px` }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <span style={{
            background: `${cat.color}22`, color: COLORS.charcoal,
            fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '5px 12px',
          }}>
            {cat.icon} {cat.label}
          </span>
          <span style={{
            background: PLATFORM_COLORS[item.platform] || COLORS.warmGrey,
            color: 'white', fontSize: 12, fontWeight: 700,
            borderRadius: 8, padding: '5px 12px',
          }}>
            {item.platform}
          </span>
        </div>

        {/* Title */}
        <p style={{
          fontSize: 18, fontWeight: 700, color: COLORS.charcoal, lineHeight: 1.45,
          letterSpacing: -0.3, marginBottom: 8,
        }}>
          {item.title}
        </p>
        <p style={{ ...TEXT.timestamp, marginBottom: 24 }}>
          Saved {timeAgo(item.savedAt)}
        </p>

        {/* Saved Privately card */}
        <div style={{
          background: COLORS.sand, borderRadius: 14, padding: '16px',
          marginBottom: 28,
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>
            🔒 Saved Privately
          </p>
          <p style={{ fontSize: 14, color: COLORS.charcoal, lineHeight: 1.55, fontWeight: 500 }}>
            Only you can see this. You can share it with your group whenever you're ready.
          </p>
        </div>

        {/* Add to Group Space */}
        {!showPicker ? (
          <button
            onClick={() => setShowPicker(true)}
            style={{
              width: '100%', height: 52, borderRadius: 14, border: 'none',
              background: COLORS.teal, color: 'white',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              letterSpacing: -0.2, marginBottom: 12,
            }}
          >
            Add to Group Space
          </button>
        ) : (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.charcoal, marginBottom: 12, letterSpacing: -0.2 }}>
              Which category in Group Space?
            </p>
            <div style={{
              borderRadius: 14, overflow: 'hidden', marginBottom: 14,
              border: `1px solid ${COLORS.border}`,
            }}>
              {allCategories.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setPickedCategory(pickedCategory === c.id ? '' : c.id)}
                  style={{
                    width: '100%', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '13px 16px', textAlign: 'left',
                    background: pickedCategory === c.id ? `${COLORS.terracotta}12` : 'white',
                    borderBottom: i < allCategories.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none',
                    borderLeft: pickedCategory === c.id ? `3px solid ${COLORS.terracotta}` : '3px solid transparent',
                  }}
                >
                  <span style={{ fontSize: 18, width: 24 }}>{c.icon}</span>
                  <span style={{
                    fontSize: 14, fontWeight: pickedCategory === c.id ? 700 : 500, flex: 1,
                    color: pickedCategory === c.id ? COLORS.terracotta : COLORS.charcoal,
                  }}>
                    {c.label}
                  </span>
                  {pickedCategory === c.id && <span style={{ color: COLORS.terracotta }}>✓</span>}
                </button>
              ))}
            </div>
            <button
              onClick={handleConfirmShare}
              disabled={!pickedCategory}
              style={{
                width: '100%', height: 52, borderRadius: 14, border: 'none',
                background: pickedCategory ? COLORS.teal : COLORS.border,
                color: pickedCategory ? 'white' : '#A79E93',
                fontSize: 15, fontWeight: 600,
                cursor: pickedCategory ? 'pointer' : 'default',
                letterSpacing: -0.2,
              }}
            >
              Confirm
            </button>
          </div>
        )}

        <button
          onClick={handleBack}
          style={{
            width: '100%', height: 48, background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 14, color: COLORS.warmGrey, fontWeight: 500,
          }}
        >
          Keep private for now
        </button>

        {currentTrip && currentTrip.members && currentTrip.members.length > 0 && (
          <div style={{ marginTop: 28, borderTop: `1px solid ${COLORS.border}`, paddingTop: 20 }}>
            <p style={{ fontSize: 12, color: COLORS.warmGrey, marginBottom: 14, fontWeight: 500 }}>
              Your group · {currentTrip.name}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {currentTrip.members.map(m => (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', background: m.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: 'white',
                  }}>
                    {m.initial}
                  </div>
                  <span style={{ fontSize: 10, color: COLORS.warmGrey, fontWeight: 600 }}>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
