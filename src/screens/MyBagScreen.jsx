import { mySavesCategories } from '../data'
import { BackButton } from '../components/BackButton'

export function MyBagScreen({ navigate }) {
  return (
    <div className="screen">
      <div style={{ padding: '18px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <BackButton onClick={() => navigate('home')} />
          <div>
            <p style={{ fontWeight: 800, fontSize: 19, color: '#1C1410', letterSpacing: -0.5 }}>My Saves</p>
            <p style={{ fontSize: 12, color: '#B5A898', marginTop: 1 }}>Private · {mySavesCategories.reduce((a, c) => a + c.count, 0)} items</p>
          </div>
        </div>

        <button
          onClick={() => navigate('saveMoment')}
          style={{
            width: '100%', height: 40, background: '#E8705A', color: 'white',
            border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 13,
            cursor: 'pointer',
            letterSpacing: -0.1,
          }}
        >
          + Save something new
        </button>
      </div>

      <div className="screen-scroll" style={{ padding: '4px 20px 32px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          Categories
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {mySavesCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate('mySavesCategory', { categoryId: cat.id })}
              className="card"
              style={{
                padding: '14px 16px', border: 'none', cursor: 'pointer',
                textAlign: 'left', display: 'flex', alignItems: 'center',
                gap: 14, width: '100%',
              }}
            >
              <div className="category-icon-box">{cat.icon}</div>

              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#1C1410', letterSpacing: -0.2, marginBottom: 2 }}>
                  {cat.label}
                </p>
                <p style={{ fontSize: 12, color: '#B5A898' }}>
                  {cat.count} {cat.count === 1 ? 'item' : 'items'} saved
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 18, color: '#E8705A' }}>{cat.count}</span>
                <span style={{ color: '#D4C8BE', fontSize: 18, fontWeight: 300 }}>›</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
