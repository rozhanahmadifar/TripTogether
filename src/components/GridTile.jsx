import { COLORS } from '../styles'
import { isImagePhoto } from '../data'

const PLATFORM_ICONS = {
  TikTok: '🎵', Instagram: '📷', Google: '🔍', Airbnb: '🏠',
  'Booking.com': '🛎️', Blog: '📝', Other: '🔗',
}

// Grid tile for gallery view: a real photo thumbnail when the item has one,
// a video icon when it's a video placeholder, a leftover "photo flagged but
// not attached" placeholder for pre-Priority-8 items, otherwise a colored
// tile with the source icon.
export function GridTile({ item, category, onOpen }) {
  const isImage = isImagePhoto(item.photo)
  return (
    <button
      onClick={onOpen}
      style={{
        display: 'flex', flexDirection: 'column', border: 'none', cursor: 'pointer',
        background: 'none', padding: 0, textAlign: 'left', fontFamily: 'inherit',
      }}
    >
      <div style={{
        width: '100%', aspectRatio: '1', borderRadius: 12, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: item.photo ? '#EFE8DE' : `${category?.color || COLORS.teal}30`,
        marginBottom: 8,
      }}>
        {isImage ? (
          <img src={item.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : item.photo ? (
          <span style={{ fontSize: 28 }}>🎬</span>
        ) : item.hasPhoto ? (
          <span style={{ fontSize: 28 }}>🖼️</span>
        ) : (
          <span style={{ fontSize: 24 }}>{PLATFORM_ICONS[item.platform] || category?.icon || '✨'}</span>
        )}
      </div>
      <p style={{
        fontSize: 12, fontWeight: 600, color: COLORS.charcoal, lineHeight: 1.3,
        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>
        {item.title}
      </p>
    </button>
  )
}
