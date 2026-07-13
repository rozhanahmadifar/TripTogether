import { groupSpaceCategories, members } from '../data'
import { MemberDot } from '../components/MemberDot'
import { BackButton } from '../components/BackButton'

export function GroupBagScreen({ navigate }) {
  return (
    <div className="screen">
      <div style={{ padding: '18px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <BackButton onClick={() => navigate('home')} />
          <div>
            <p style={{ fontWeight: 800, fontSize: 19, color: '#1C1410', letterSpacing: -0.5 }}>Group Space</p>
            <p style={{ fontSize: 12, color: '#B5A898', marginTop: 1 }}>Ireland Trip · 44 items</p>
          </div>
        </div>

        {/* Members strip */}
        <div className="card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex' }}>
            {members.map((m, i) => (
              <div
                key={m.id}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: m.color, border: '2px solid white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: 'white',
                  marginLeft: i === 0 ? 0 : -7, zIndex: 10 - i,
                }}
              >
                {m.initial}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#8A7A6A' }}>
            <strong style={{ color: '#1C1410' }}>5 members</strong> all contributing
          </p>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: '4px 20px 32px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          Categories
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {groupSpaceCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate('groupCategory', { categoryId: cat.id })}
              className="card"
              style={{
                padding: '14px 16px', border: 'none', cursor: 'pointer',
                textAlign: 'left', display: 'flex', alignItems: 'center',
                gap: 14, width: '100%',
              }}
            >
              <div className="category-icon-box">{cat.icon}</div>

              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#1C1410', letterSpacing: -0.2, marginBottom: 5 }}>
                  {cat.label}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex' }}>
                    {cat.contributors.map((id, i) => (
                      <MemberDot key={id} memberId={id} size={18} style={{ marginLeft: i === 0 ? 0 : -4 }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: '#B5A898' }}>
                    {cat.contributors.length} {cat.contributors.length === 1 ? 'person' : 'people'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 18, color: '#E8705A' }}>{cat.count}</span>
                <span style={{ color: '#D4C8BE', fontSize: 18, fontWeight: 300 }}>›</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('saveMoment', { destination: 'group' })}
          style={{
            marginTop: 16, width: '100%', height: 44,
            background: '#E8705A', color: 'white', border: 'none',
            borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: 'pointer',
            letterSpacing: -0.1,
          }}
        >
          + Add to Group Space
        </button>
      </div>
    </div>
  )
}
