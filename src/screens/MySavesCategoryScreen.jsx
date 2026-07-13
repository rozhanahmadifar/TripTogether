import { mySavesItems, categories } from '../data'
import { ItemImage } from '../components/ItemImage'
import { BackButton } from '../components/BackButton'

export function MySavesCategoryScreen({ navigate, params = {} }) {
  const { categoryId } = params
  const cat = categories.find(c => c.id === categoryId) || categories[0]
  const items = mySavesItems.filter(i => i.category === categoryId)

  const daysAgoLabel = (n) => {
    if (n === 1) return 'Yesterday'
    if (n < 7) return `${n} days ago`
    return `${Math.floor(n / 7)} week${Math.floor(n / 7) > 1 ? 's' : ''} ago`
  }

  const backTo = params.backTo || 'mySaves'

  return (
    <div className="screen">
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => navigate(backTo)} />
        <div>
          <p style={{ fontWeight: 800, fontSize: 19, color: '#1C1410', letterSpacing: -0.5 }}>
            {cat.icon} {cat.label}
          </p>
          <p style={{ fontSize: 12, color: '#B5A898', marginTop: 1 }}>My Saves · {items.length} items</p>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: '4px 20px 32px' }}>
        {items.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            background: '#fff', borderRadius: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.05)',
          }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>{cat.icon}</span>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1C1410', marginBottom: 6 }}>Nothing saved here yet</p>
            <p style={{ fontSize: 13, color: '#B5A898', lineHeight: 1.4 }}>Save something and choose {cat.label} as the category.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => navigate('mySavesItem', { itemId: item.id })}
              className="card"
              style={{
                display: 'flex', alignItems: 'center', border: 'none',
                cursor: 'pointer', textAlign: 'left', width: '100%', overflow: 'hidden',
                padding: 0,
              }}
            >
              {/* Thumbnail */}
              <div style={{ width: 84, flexShrink: 0 }}>
                <ItemImage type={item.image} height={84} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: '12px 14px 12px 14px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <span
                    className="platform-badge"
                    style={{ background: item.platformColor }}
                  >
                    {item.platform}
                  </span>
                  <span style={{ fontSize: 11, color: '#B5A898' }}>{daysAgoLabel(item.savedDaysAgo)}</span>
                </div>
                <p style={{
                  fontWeight: 700, fontSize: 14, color: '#1C1410', lineHeight: 1.3,
                  letterSpacing: -0.2,
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {item.title}
                </p>
              </div>

              <span style={{ color: '#D4C8BE', fontSize: 16, paddingRight: 14, flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('saveMoment')}
          style={{
            marginTop: 16, width: '100%', height: 40,
            background: 'transparent', border: '1.5px dashed #D4C8BE',
            borderRadius: 12, cursor: 'pointer', fontSize: 13,
            fontWeight: 600, color: '#B5A898',
          }}
        >
          + Save something to {cat.label}
        </button>
      </div>
    </div>
  )
}
