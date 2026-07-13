import { mySavesItems, categories } from '../data'
import { ItemImage } from '../components/ItemImage'
import { BackButton } from '../components/BackButton'

export function MySavesItemScreen({ navigate, params = {} }) {
  const item = mySavesItems.find(i => i.id === params.itemId) || mySavesItems[0]
  const cat = categories.find(c => c.id === item.category)

  const daysAgoLabel = (n) => {
    if (n === 1) return 'Yesterday'
    if (n < 7) return `${n} days ago`
    return `${Math.floor(n / 7)} week${Math.floor(n / 7) > 1 ? 's' : ''} ago`
  }

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => navigate('mySavesCategory', { categoryId: item.category })} />
        <p style={{ fontWeight: 700, fontSize: 17, color: '#1C1410', letterSpacing: -0.3 }}>Saved item</p>
      </div>

      <div className="screen-scroll" style={{ padding: '0 20px 40px' }}>
        {/* Main image */}
        <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
          <ItemImage type={item.image} height={210} />
          <div style={{ padding: '14px 16px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className="platform-badge" style={{ background: item.platformColor }}>
                {item.platform}
              </span>
              <span style={{ fontSize: 12, color: '#B5A898' }}>Saved {daysAgoLabel(item.savedDaysAgo)}</span>
              <span style={{
                marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                background: '#FEF0EB', color: '#E8705A', borderRadius: 8,
                padding: '3px 9px',
              }}>
                {cat?.icon} {cat?.label}
              </span>
            </div>

            <p style={{ fontSize: 18, fontWeight: 800, color: '#1C1410', lineHeight: 1.3, letterSpacing: -0.4, marginBottom: 8 }}>
              {item.title}
            </p>

            <p style={{ fontSize: 14, color: '#8A7A6A', lineHeight: 1.5 }}>
              {item.note}
            </p>
          </div>
        </div>

        {/* Divider label */}
        <p style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          Saved privately
        </p>

        <div className="card" style={{ padding: '14px 16px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#8A7A6A', lineHeight: 1.5 }}>
            Only you can see this. You can share it with your group whenever you're ready. It'll move to the Group Space where everyone can react and comment.
          </p>
        </div>

        {/* Add to Group Space CTA */}
        <button
          onClick={() => navigate('saveMoment', { destination: 'group' })}
          style={{
            width: '100%', height: 50, background: '#E8705A', color: 'white',
            border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 15,
            cursor: 'pointer',
            letterSpacing: -0.2,
          }}
        >
          🌍 Add to Group Space
        </button>

        <button
          onClick={() => navigate('mySavesCategory', { categoryId: item.category })}
          style={{
            width: '100%', marginTop: 10, height: 40,
            background: 'transparent', border: 'none',
            cursor: 'pointer', fontSize: 13, color: '#B5A898', fontWeight: 500,
          }}
        >
          Keep private for now
        </button>
      </div>
    </div>
  )
}
