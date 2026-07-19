import { COLORS, CATEGORY_COLORS } from '../styles'
import { isImagePhoto } from '../data'

const PLATFORM_ICONS = {
  TikTok: '🎵', Instagram: '📷', Google: '🔍', Airbnb: '🏠',
  'Booking.com': '🛎️', Blog: '📝', Other: '🔗',
}

// Curated warm tones (not each item's raw category color) so no-photo tiles
// vary tile-to-tile within the same category instead of all sharing one
// flat tint.
const WARM_TONES = [
  COLORS.sand,
  `${COLORS.terracotta}22`,
  `${CATEGORY_COLORS.inspiration}30`,
  `${CATEGORY_COLORS.food}26`,
]

// Cycled the same way as WARM_TONES so placeholder tiles vary in height
// like real photos do, keeping the masonry feel even in all-no-photo boards.
const PLACEHOLDER_RATIOS = ['1 / 1', '4 / 5', '3 / 4', '5 / 6']

function hashString(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

// Mood-board grid tile: real photos render at their natural aspect ratio
// (driving the masonry effect via CSS columns on the parent), no-photo tiles
// get a cycled warm tone + aspect ratio instead. The title overlays the
// bottom of every tile behind a soft gradient rather than sitting below it.
export function GridTile({ item, category, onOpen }) {
  const isImage = isImagePhoto(item.photo)
  const hash = hashString(item.id || item.title || '')
  const tone = WARM_TONES[hash % WARM_TONES.length]
  const ratio = PLACEHOLDER_RATIOS[hash % PLACEHOLDER_RATIOS.length]

  return (
    <button
      onClick={onOpen}
      style={{
        display: 'block', width: '100%', border: 'none', cursor: 'pointer',
        background: 'none', padding: 0, textAlign: 'left', fontFamily: 'inherit',
        borderRadius: 18, overflow: 'hidden', position: 'relative',
        breakInside: 'avoid', marginBottom: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      }}
    >
      {isImage ? (
        <img src={item.photo} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      ) : (
        <div style={{
          width: '100%', aspectRatio: ratio,
          background: item.photo || item.hasPhoto ? '#EFE8DE' : tone,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Fixed-size circle so every glyph occupies the same visual
              footprint — raw emoji at a shared font-size still render at
              inconsistent apparent sizes depending on the glyph itself. */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 26, lineHeight: 1 }}>
              {item.photo ? '🎬' : item.hasPhoto ? '🖼️' : (PLATFORM_ICONS[item.platform] || category?.icon || '✨')}
            </span>
          </div>
        </div>
      )}

      {item.starredBy?.length > 0 && (
        <span
          title={`Marked as decided by ${item.starredBy.join(', ')}`}
          style={{
            position: 'absolute', top: 8, left: 8,
            width: 24, height: 24, borderRadius: '50%',
            background: COLORS.teal, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
          }}
        >
          ✓
        </span>
      )}

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '24px 10px 10px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.72), transparent)',
      }}>
        <p style={{
          fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.3,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          textShadow: '0 1px 3px rgba(0,0,0,0.35)',
        }}>
          {item.title}
        </p>
      </div>
    </button>
  )
}
