import { COLORS, CATEGORY_COLORS } from '../styles'
import { isImagePhoto, displayTitle } from '../data'

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

// No-photo tiles all share one fixed aspect ratio so their icons line up
// row-to-row — varying the ratio per tile (like real photos naturally do)
// made same-content icon tiles look misaligned and inconsistently sized.
const PLACEHOLDER_RATIO = '4 / 5'

function hashString(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

// Mood-board grid tile: real photos render at their natural aspect ratio
// (driving the masonry effect via CSS columns on the parent), no-photo tiles
// get a cycled warm tone at a fixed aspect ratio instead. The title overlays
// the bottom of every tile behind a soft gradient rather than sitting below it.
export function GridTile({ item, category, onOpen, decidable = false }) {
  const isImage = isImagePhoto(item.photo)
  const hash = hashString(item.id || item.title || '')
  const tone = WARM_TONES[hash % WARM_TONES.length]
  const decided = item.starredBy?.length > 0

  return (
    <button
      onClick={onOpen}
      style={{
        display: 'block', width: '100%', cursor: 'pointer',
        background: 'none', padding: 0, textAlign: 'left', fontFamily: 'inherit',
        borderRadius: 18, overflow: 'hidden', position: 'relative',
        border: `2px solid ${decided ? COLORS.milestone : 'transparent'}`,
        breakInside: 'avoid', marginBottom: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      }}
    >
      {isImage ? (
        <img src={item.photo} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      ) : (
        <div style={{
          width: '100%', aspectRatio: PLACEHOLDER_RATIO,
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

      {decided ? (
        <span
          title={`Marked as decided by ${item.starredBy.join(', ')}`}
          style={{
            position: 'absolute', top: 8, left: 8,
            display: 'flex', alignItems: 'center', gap: 3,
            background: COLORS.milestone, color: 'white',
            fontSize: 10, fontWeight: 800, letterSpacing: 0.2,
            borderRadius: 20, padding: '4px 8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
          }}
        >
          ✓ Decided
        </span>
      ) : decidable && (
        // Tapping this whole tile marks the item as decided (there's no
        // separate detail view for group items to hold a real checkbox) —
        // without some visible sign of that, tapping a tile just to look at
        // it silently decides it, with nothing to explain why. This makes
        // the same tap-anywhere behavior visible instead of invisible.
        <span
          title="Tap to mark as decided"
          style={{
            position: 'absolute', top: 8, left: 8,
            width: 22, height: 22, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.9)',
            background: 'rgba(0,0,0,0.18)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
          }}
        />
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
          {displayTitle(item)}
        </p>
      </div>
    </button>
  )
}
