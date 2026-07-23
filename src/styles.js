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
  scrollBottomPad: 88,
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
