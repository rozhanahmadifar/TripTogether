// Each category carries two tones, not one: `color` is the soft base used for
// tinted backgrounds/badges (unchanged from before), `shade` is a deeper pull
// of the same hue used for icon strokes/fills and anywhere that base tint
// would be too low-contrast to read as a mark on its own — same six hues,
// more tonal depth instead of one flat color reused at different opacities.
export const CATEGORIES = [
  { id: 'inspiration',   icon: '✨', label: 'Inspiration',   color: '#E8B84A', shade: '#C4922A' },
  { id: 'destination',   icon: '📍', label: 'Destination',   color: '#5B8DBE', shade: '#3D6B98' },
  { id: 'accommodation', icon: '🏨', label: 'Accommodation', color: '#6BAE8A', shade: '#4A8A68' },
  { id: 'activities',    icon: '🎯', label: 'Activities',    color: '#D9805A', shade: '#B85F3A' },
  { id: 'transport',     icon: '🚌', label: 'Transport',     color: '#9B8AC4', shade: '#7563A0' },
  { id: 'food',          icon: '🍔', label: 'Food',          color: '#C2678D', shade: '#9C4468' },
]

// Curated real photography (Pexels — free to hotlink, each picked and
// visually checked during this session) used as backdrop art on category
// headers, empty states, and the trip hero card once a destination is set.
// Deliberately not used on individual item/grid cards — the same stock photo
// repeated across several same-category items would read as fake, not real;
// one photo per category, used once per screen, reads as intentional art
// direction instead. `w=800` keeps the downloaded size proportional to
// where these actually render (never full desktop resolution).
export const CATEGORY_PHOTOS = {
  inspiration:   'https://images.pexels.com/photos/8828672/pexels-photo-8828672.jpeg?auto=compress&cs=tinysrgb&w=800',
  destination:   'https://images.pexels.com/photos/38160670/pexels-photo-38160670.jpeg?auto=compress&cs=tinysrgb&w=800',
  accommodation: 'https://images.pexels.com/photos/15667603/pexels-photo-15667603.jpeg?auto=compress&cs=tinysrgb&w=800',
  activities:    'https://images.pexels.com/photos/914128/pexels-photo-914128.jpeg?auto=compress&cs=tinysrgb&w=800',
  transport:     'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800',
  food:          'https://images.pexels.com/photos/7973622/pexels-photo-7973622.jpeg?auto=compress&cs=tinysrgb&w=800',
}

// The Welcome screen's hero backdrop — sits outside the per-category set
// since it's shown before any trip/category exists.
export const WELCOME_PHOTO = 'https://images.pexels.com/photos/38463518/pexels-photo-38463518.jpeg?auto=compress&cs=tinysrgb&w=900'

// The Home screen's "Plan a trip together" card — its own photo rather than
// a CATEGORY_PHOTOS entry, since those are reserved one-per-category.
export const PLAN_TOGETHER_PHOTO = 'https://images.pexels.com/photos/9943247/pexels-photo-9943247.jpeg?auto=compress&cs=tinysrgb&w=800'

// The Home screen's My Ideas card — its own photo, not CATEGORY_PHOTOS.inspiration
// (a colorful map/notebook scene, wrong mood for this light "journal" card and
// already doing double duty as the Inspiration category's own header art). A
// warm flat-lay of travel keepsakes — straw hat, daisies, a stamped passport
// case, a compass — on cream marble, matching the soft/paper-toned card style.
export const MY_IDEAS_PHOTO = 'https://images.pexels.com/photos/7235807/pexels-photo-7235807.jpeg?auto=compress&cs=tinysrgb&w=800'

// The Home screen's atmosphere band — pure mood/branding, distinct from
// every other photo already used on that screen (destination photo → trip
// card, inspiration photo → My Ideas, this one → PLAN_TOGETHER_PHOTO).
// Wide horizontal composition with open sky so it crops well into a short
// full-bleed strip and still leaves room for a line of text.
export const ATMOSPHERE_PHOTO = 'https://images.pexels.com/photos/30784224/pexels-photo-30784224.jpeg?auto=compress&cs=tinysrgb&w=1000'

// One-line clarifying hints shown under each category name in the tag
// picker, so it's obvious at a glance where something belongs instead of
// guessing from the label alone.
export const CATEGORY_HINTS = {
  inspiration: 'Sparks excitement, not planned yet',
  destination: "A place you're considering",
  accommodation: 'Where you might stay',
  activities: "Things you're actually planning to do",
  transport: "How you'll get there or around",
  food: 'Restaurants or food spots',
}

export const EMPTY_STATE_COPY = {
  inspiration: {
    subtext: 'Start saving places, videos, and ideas that catch your eye.',
  },
  destination: {
    subtext: 'Start dropping pins on the places that are calling your name.',
  },
  accommodation: {
    subtext: 'Start collecting stays that feel like home away from home.',
  },
  activities: {
    subtext: 'Start saving the adventures you don’t want to miss.',
  },
  transport: {
    subtext: 'Start saving flights, trains, and the way you’ll get there.',
  },
  food: {
    subtext: 'Start saving restaurants and dishes you don’t want to miss.',
  },
  default: {
    subtext: 'Be the first to add something here.',
  },
}

export const PLATFORMS = ['TikTok', 'Instagram', 'Google', 'Airbnb', 'Booking.com', 'Blog', 'Other']

export const PLATFORM_COLORS = {
  TikTok:        '#010101',
  Instagram:     '#C13584',
  Google:        '#4285F4',
  Airbnb:        '#FF5A5F',
  'Booking.com': '#003580',
  Blog:          '#5A8A6A',
  Other:         '#8A7F74',
}

// Darkened from their original, brighter values — as fills behind a white
// avatar initial, most of these measured well below the 4.5:1 WCAG AA
// minimum for text (as low as 1.84:1 for the yellow). These hold ~4.6-4.9:1.
export const MEMBER_COLORS = ['#1E5F5F', '#AA5B3B', '#4B7A61', '#4D78A1', '#7C6E9D', '#8B6E2C']

function hashString(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

// A person's avatar color is derived from their name, not their position in
// whatever members list happens to be rendering them — so the same person
// (e.g. the trip creator, or a crew member added to more than one trip)
// reads as the same color on every screen, regardless of join order. Used
// for one-off lookups (contributor avatars on a saved item, a message
// sender) where there's no "list of members" to assign against — a hash
// can collide (two different names landing on the same or a similarly-toned
// color), which is fine there since it's never comparing two colors
// side by side, just identifying one person consistently.
export function colorForName(name) {
  if (!name) return MEMBER_COLORS[0]
  return MEMBER_COLORS[hashString(name) % MEMBER_COLORS.length]
}

// For assigning a *new* trip member's permanent color, where a hash
// collision would actually be visible (two avatars sitting side by side in
// "Traveling with"). Picks the first palette color not already used by this
// trip's existing members, so every member reads as a distinct color for as
// long as the palette allows — only repeating once a trip has more members
// than MEMBER_COLORS has entries.
export function nextMemberColor(usedColors = []) {
  const used = new Set(usedColors)
  const unused = MEMBER_COLORS.find(c => !used.has(c))
  return unused || MEMBER_COLORS[usedColors.length % MEMBER_COLORS.length]
}

// Keeps long member names from breaking avatar/member-list layouts.
export function truncateName(name, max = 20) {
  if (!name) return ''
  return name.length > max ? `${name.slice(0, max)}…` : name
}

// Matches a pasted link against known domains so the source chip can be
// pre-selected automatically. Returns '' when nothing matches.
export function detectSourceFromLink(url) {
  if (!url) return ''
  const lower = url.toLowerCase()
  if (lower.includes('instagram.com'))  return 'Instagram'
  if (lower.includes('tiktok.com'))     return 'TikTok'
  if (lower.includes('airbnb.com'))     return 'Airbnb'
  if (lower.includes('booking.com'))    return 'Booking.com'
  if (lower.includes('google'))         return 'Google'
  return ''
}

// item.photo is either a real image (a data URL from FileReader, or a
// remote https:// URL from an auto-fetched link preview) or, for videos,
// just the filename as a placeholder — this tells them apart so we never
// try to render a video filename as an <img> src.
export function isImagePhoto(photo) {
  return typeof photo === 'string' && (photo.startsWith('data:image') || photo.startsWith('http://') || photo.startsWith('https://'))
}

// The title stays genuinely optional — some people want to name what they
// save, others don't. This just gives a title-less item something readable
// to show wherever a title would normally go, instead of either blank
// space or a raw URL.
export function displayTitle(item) {
  if (item.title) return item.title
  if (item.platform) return `Saved from ${item.platform}`
  if (item.link) return 'Saved link'
  if (item.note) return 'Saved note'
  if (item.photo) return isImagePhoto(item.photo) ? 'Saved photo' : 'Saved video'
  return 'Saved item'
}

// A lightweight shape check (not full RFC 5322 validation) — just enough to
// catch an obviously incomplete address before it's used to gate adding a
// member, since email is now required rather than optional.
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export const timeAgo = (ts) => {
  const mins = Math.floor((Date.now() - ts) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

// Trip dates are stored as an ISO string (`startDate`) alongside the
// human-readable label (`dates`) so a real countdown can be computed
// wherever it's shown (trip home, Group Space), from one place.
export function daysUntil(isoDate) {
  const target = new Date(isoDate)
  target.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target - today) / 86400000)
}

export function countdownLabel(days) {
  if (days > 1) return `${days} days until departure`
  if (days === 1) return '1 day until departure'
  if (days === 0) return 'Departing today!'
  return 'Trip underway'
}
