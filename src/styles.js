// Emotional design goals: collaborative, safe, joyful. See COLORS/TEXT below —
// every token exists to serve one of those three feelings.
export const COLORS = {
  // Backgrounds — subtly differentiated by context (paper journal vs shared noticeboard)
  bg: '#F7F4F0',
  bgMyIdeas: '#FBF7F2',
  bgGroupSpace: '#F4F8F7',
  cardBg: '#FFFFFF',

  // Brand
  teal: '#1E5F5F',
  tealLight: '#2D7A7A',
  tealTint: '#E4F0EF',
  sand: '#F0E8DC',
  // Darkened from the original #D4724A — at full brightness, white button
  // text on this background measured 3.33:1, below the 4.5:1 WCAG AA
  // minimum for normal text (the button label isn't large/bold enough to
  // qualify for the lower 3:1 large-text threshold). This shade holds
  // ~4.9:1 both as a button fill (white text) and as a foreground text
  // color on the app's light backgrounds.
  terracotta: '#AA5B3B',
  danger: '#D94040',

  // Reserved for primary actions only (the one "tap this to move forward"
  // button per screen) — teal is used everywhere as the structural/brand
  // color (headers, gradients, cards), so reusing it for buttons makes
  // them blend into the backgrounds instead of standing out from them.
  action: '#AA5B3B',

  // Reserved exclusively for progress/completion/milestone moments —
  // a decided category, a fully-decided trip, a countdown crossing a
  // meaningful threshold. Never used as plain decoration, so it always
  // reads as "something meaningful just happened."
  milestone: '#3A7D5A',
  // A tint light enough to keep milestone-colored text at ~4.5:1 — a
  // stronger tint (matching tealTint's mix ratio) dropped text contrast
  // to ~4.2:1.
  milestoneTint: '#F3F7F5',

  // Text
  charcoal: '#1A1A1A',
  warmGrey: '#5A5048',

  // Structure
  border: '#E5DDD4',
  borderLight: '#EFE8DE',
  // For subtle-but-functional marks (chevrons, an unfilled checkbox
  // outline) that need to clear the 3:1 non-text/UI-component contrast
  // minimum — the previous ad hoc greys here (#D6CCBF, #C9BFB2) measured
  // ~1.6-1.8:1 against white, barely visible.
  subtleIcon: '#96897C',

  // legacy alias kept for components still referencing .coral
  coral: '#AA5B3B',
}

// Section 10 — typography scale, applied consistently everywhere
export const TEXT = {
  appName:        { fontSize: 30, fontWeight: 800, color: COLORS.teal, letterSpacing: -0.6, lineHeight: 1.05 },
  screenTitle:    { fontSize: 24, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.4, lineHeight: 1.15 },
  sectionHeading: { fontSize: 11, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 1.5, textTransform: 'uppercase', lineHeight: 1.3 },
  cardTitle:      { fontSize: 16, fontWeight: 600, color: COLORS.charcoal, letterSpacing: -0.2, lineHeight: 1.35 },
  body:           { fontSize: 14, fontWeight: 400, color: COLORS.charcoal, lineHeight: 1.5 },
  subtext:        { fontSize: 12, fontWeight: 400, color: COLORS.warmGrey, lineHeight: 1.4 },
  buttonText:     { fontSize: 15, fontWeight: 600 },
  timestamp:      { fontSize: 12, fontWeight: 400, color: COLORS.warmGrey, lineHeight: 1.4 },

  // Supplementary tokens (not part of the 8-tier core scale, but needed for
  // specific moments called out in the brief)
  greeting:           { fontSize: 14, fontWeight: 400, color: COLORS.warmGrey, lineHeight: 1.3 },
  categoryRowName:    { fontSize: 15, fontWeight: 600, color: COLORS.charcoal, letterSpacing: -0.1 },
  categoryRowSubtext: { fontSize: 13, fontWeight: 400, color: COLORS.warmGrey },
}

// Section 10 — spacing system
export const SPACING = {
  screenX: 20,
  cardGap: 12,
  cardPad: 16,
  sectionGap: 28,
  headingGap: 10,
  // The floating "+" button's own footprint (52px button + 4px gap + its
  // label pill) is ~76px tall, offset 16-76px above the screen's true
  // bottom edge depending on whether the bottom nav is showing. 88 sat
  // right at that boundary with ~1-3px of slack — any shadow bleed or
  // rounding was enough to make card content look like it touched the
  // button when scrolled to the end. This adds real breathing room.
  scrollBottomPad: 116,
  tabBarHeight: 64,
  buttonMinHeight: 52,
  inputMinHeight: 48,
}

export const SHADOW_CARD = '0 2px 12px rgba(0,0,0,0.06)'
export const SHADOW_SOFT = '0 2px 8px rgba(0,0,0,0.05)'

// Each of the five default categories gets its own gentle colour (section 3 / 5)
export const CATEGORY_COLORS = {
  inspiration:   '#E8B84A', // soft yellow
  destination:   '#5B8DBE', // soft blue
  accommodation: '#6BAE8A', // soft green
  activities:    '#D9805A', // soft coral
  transport:     '#9B8AC4', // soft purple
  food:          '#C2678D', // soft rose
}

// A shared travel/map motif for the trip header card, used identically on
// both the full trip home card and its My Trips summary card (a plain dot
// texture read as generic and static in testing — this keeps the same
// underlying route-map idea but at a scale that reads at either size).
// The teal gradient is layered on TOP as a translucent overlay rather than
// a flat fill, so the motif shows through everywhere at once instead of
// only in the gaps around text — while staying opaque enough (~93%) that
// white text contrast measured for the old flat fill still holds.
const FLIGHT_PATH_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220">
    <path d="M24 196 Q 160 150 200 90 T 372 24" fill="none" stroke="white" stroke-width="2" stroke-dasharray="1 9" stroke-linecap="round" opacity="0.4"/>
    <circle cx="24" cy="196" r="4.5" fill="white" opacity="0.55"/>
    <g transform="translate(360,20) rotate(-40)">
      <path d="M0 5 L18 0 L18 10 Z" fill="white" opacity="0.6"/>
    </g>
  </svg>`
)

export function tripCardBackground() {
  return {
    backgroundImage: [
      `linear-gradient(135deg, rgba(30,95,95,0.93) 0%, rgba(45,122,122,0.93) 100%)`,
      `radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1.4px)`,
      `radial-gradient(ellipse 55% 60% at 90% 4%, rgba(240,232,220,0.14), transparent 70%)`,
      `radial-gradient(ellipse 60% 55% at 2% 98%, rgba(240,232,220,0.10), transparent 70%)`,
      `url("data:image/svg+xml,${FLIGHT_PATH_SVG}")`,
    ].join(', '),
    backgroundSize: 'cover, 16px 16px, cover, cover, cover',
    backgroundRepeat: 'no-repeat, repeat, no-repeat, no-repeat, no-repeat',
    backgroundColor: COLORS.teal,
  }
}
