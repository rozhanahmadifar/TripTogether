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
  terracotta: '#D4724A',
  success: '#3A7D5A',
  danger: '#D94040',

  // Text
  charcoal: '#1A1A1A',
  warmGrey: '#5A5048',

  // Structure
  border: '#E5DDD4',
  borderLight: '#EFE8DE',

  // legacy alias kept for components still referencing .coral
  coral: '#D4724A',
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
