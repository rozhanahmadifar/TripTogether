import { COLORS } from '../styles'
import { BackButton } from '../components/BackButton'

export function ShareSuccessScreen({ navigate, params = {}, currentTrip, openTrip, allCategories }) {
  const cat = allCategories.find(c => c.id === params.categoryId)

  const goToGroupSpace = () => {
    if (currentTrip) openTrip(currentTrip.id)
    else navigate('groupHome')
  }

  return (
    <div className="screen" style={{ background: 'white' }}>
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${COLORS.border}` }}>
        <BackButton onClick={() => navigate('individualHome')} />
      </div>
      <div className="screen-scroll" style={{ padding: '32px 28px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Success icon — gentle upward float */}
        <div className="check-float" style={{
          width: 84, height: 84, borderRadius: '50%',
          background: COLORS.success,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, marginBottom: 28, color: 'white',
          boxShadow: `0 8px 28px ${COLORS.success}59`,
        }}>
          ✓
        </div>

        <h2 style={{
          fontSize: 24, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.4,
          textAlign: 'center', marginBottom: 12,
        }}>
          Added to Group Space
        </h2>

        {cat && (
          <div style={{
            background: `${cat.color}22`, borderRadius: 10, padding: '7px 18px', marginBottom: 12,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.charcoal }}>
              {cat.icon} {cat.label}
            </span>
          </div>
        )}

        <p style={{ fontSize: 14, color: COLORS.warmGrey, textAlign: 'center', lineHeight: 1.55, marginBottom: 36, fontWeight: 500 }}>
          Your group can now see this.
        </p>

        {currentTrip && currentTrip.members && currentTrip.members.length > 0 && (
          <div style={{ marginBottom: 44, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: COLORS.warmGrey, marginBottom: 16, fontWeight: 500 }}>
              Shared with {currentTrip.name}
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              {currentTrip.members.map(m => (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: m.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: 'white',
                    boxShadow: `0 2px 10px ${m.color}50`,
                  }}>
                    {m.initial}
                  </div>
                  <span style={{ fontSize: 11, color: COLORS.warmGrey, fontWeight: 600 }}>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={goToGroupSpace}
          style={{
            width: '100%', height: 52, borderRadius: 14, border: 'none',
            background: COLORS.teal, color: 'white',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            letterSpacing: -0.2, marginBottom: 12,
          }}
        >
          Go to Group Space
        </button>

        <button
          onClick={() => navigate('saveSomething')}
          style={{
            width: '100%', height: 48, background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 14, color: COLORS.warmGrey, fontWeight: 600,
          }}
        >
          Save something else
        </button>
      </div>
    </div>
  )
}
