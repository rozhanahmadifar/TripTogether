// A single, consistent line-icon set for the six category markers — replaces
// OS emoji (🍔 📍 🏨 🎯 🚌 ✨), which render as a different glyph on every
// platform (Windows/Mac/Android all ship different emoji art) and read as
// visually unfinished next to the app's otherwise custom icon work (see
// TabIcons.jsx for the nav bar, which was already SVG). These stay
// functional-chrome only — decorative emoji a user typed themselves (in a
// note, a trip name) are unaffected.
const ICONS = {
  inspiration: (props) => (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill={props.color}>
      <path d="M12 2.5c.6 3.3 1.4 5.4 2.9 6.9 1.5 1.5 3.6 2.3 6.9 2.9-3.3.6-5.4 1.4-6.9 2.9-1.5 1.5-2.3 3.6-2.9 6.9-.6-3.3-1.4-5.4-2.9-6.9-1.5-1.5-3.6-2.3-6.9-2.9 3.3-.6 5.4-1.4 6.9-2.9 1.5-1.5 2.3-3.6 2.9-6.9Z" />
    </svg>
  ),
  destination: (props) => (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.5c4.2-4.6 7-8.3 7-12A7 7 0 0 0 5 9.5c0 3.7 2.8 7.4 7 12Z" />
      <circle cx="12" cy="9.5" r="2.4" fill={props.color} stroke="none" />
    </svg>
  ),
  accommodation: (props) => (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V19a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 20v-5.5h5V20" />
    </svg>
  ),
  activities: (props) => (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke={props.color} strokeWidth="2" />
      <circle cx="12" cy="12" r="4.8" fill="none" stroke={props.color} strokeWidth="2" />
      <circle cx="12" cy="12" r="1.6" fill={props.color} />
    </svg>
  ),
  transport: (props) => (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="12" rx="2.5" />
      <path d="M3.5 11h17" />
      <circle cx="7.5" cy="17" r="1.4" fill={props.color} stroke="none" />
      <circle cx="16.5" cy="17" r="1.4" fill={props.color} stroke="none" />
      <path d="M7 5V3.3M17 5V3.3" />
    </svg>
  ),
  food: (props) => (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 3v7a2.5 2.5 0 0 0 5 0V3" />
      <path d="M9 3v18" />
      <path d="M16.5 3c-1.4 0-2.5 1.8-2.5 5.5 0 2.6 1 4 2 4.5v7" />
    </svg>
  ),
}

const DEFAULT = ICONS.inspiration

export function CategoryIcon({ id, size = 18, color = 'currentColor' }) {
  const Render = ICONS[id] || DEFAULT
  return <Render size={size} color={color} />
}

// The consistently-sized colored circular marker used everywhere a category
// needs a standalone visual anchor (list rows, tag pickers, item card
// headers). `tint` fills the soft background disc; `shade` — the category's
// deeper companion tone — draws the icon itself, so the mark has real
// contrast against its own badge instead of the icon and background being
// two opacities of the same flat color.
export function CategoryIconBadge({ id, tint, shade, size = 42, iconSize }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      // A gradient tint instead of one flat opacity — the badge picks up a
      // little dimensionality of its own (like a soft embossed disc) rather
      // than reading as a color swatch pasted behind the icon.
      background: `linear-gradient(145deg, ${tint}38 0%, ${tint}18 100%)`,
      boxShadow: `inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 2px ${tint}25`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <CategoryIcon id={id} size={iconSize || Math.round(size * 0.44)} color={shade || tint} />
    </div>
  )
}

// A scattered dot texture in the category's own tint — the same "duotone
// illustration" idea design research pointed at (two dominant hues from one
// image, here the soft tint + the deeper shade) rather than a flat icon
// floating on nothing. Reuses the dot-grid motif already established on the
// trip hero card (see tripCardBackground in styles.js) so this reads as the
// same visual language, not a new one introduced just for empty states.
const DOTS = [
  [26, 32, 3.2, 0.55], [132, 26, 2.6, 0.45], [142, 96, 3.6, 0.5],
  [18, 116, 2.2, 0.45], [80, 16, 2, 0.4], [112, 138, 2.8, 0.4],
  [40, 142, 2.2, 0.4], [148, 60, 2, 0.35],
]

// The empty-state illustration. With a `photoUrl` (the category's curated
// real photo — see CATEGORY_PHOTOS in data.js), it's a real photo behind a
// tinted glass circle with the icon centered on top; without one (the
// cross-category "Nothing decided yet" state has no single category to
// photograph) it falls back to the original geometric dot-texture disc, so
// this never renders blank.
export function CategoryIllustration({ id, color, shade, size = 120, photoUrl }) {
  if (photoUrl) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', overflow: 'hidden',
        position: 'relative', flexShrink: 0,
        backgroundImage: [
          `linear-gradient(175deg, ${color}4D 0%, ${shade || color}B3 100%)`,
          `url("${photoUrl}")`,
        ].join(', '),
        backgroundSize: 'cover, cover', backgroundPosition: 'center, center',
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CategoryIcon id={id} size={Math.round(size * 0.34)} color="white" />
        </div>
      </div>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 160 160">
      <circle cx="80" cy="80" r="80" fill={`${color}26`} />
      {DOTS.map(([cx, cy, r, o], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={color} opacity={o} />
      ))}
      <g transform="translate(48,48)">
        <CategoryIcon id={id} size={64} color={shade || color} />
      </g>
    </svg>
  )
}
