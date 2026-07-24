export const CATEGORIES = [
  { id: 'inspiration',   icon: '✨', label: 'Inspiration',   color: '#E8B84A' },
  { id: 'destination',   icon: '📍', label: 'Destination',   color: '#5B8DBE' },
  { id: 'accommodation', icon: '🏨', label: 'Accommodation', color: '#6BAE8A' },
  { id: 'activities',    icon: '🎯', label: 'Activities',    color: '#D9805A' },
  { id: 'transport',     icon: '🚌', label: 'Transport',     color: '#9B8AC4' },
  { id: 'food',          icon: '🍔', label: 'Food',          color: '#C2678D' },
]

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
    emojis: ['✨', '💡'],
    subtext: 'Start saving places, videos, and ideas that catch your eye.',
  },
  destination: {
    emojis: ['📍', '🗺️'],
    subtext: 'Start dropping pins on the places that are calling your name.',
  },
  accommodation: {
    emojis: ['🏠', '🔑'],
    subtext: 'Start collecting stays that feel like home away from home.',
  },
  activities: {
    emojis: ['🎯', '🧭'],
    subtext: 'Start saving the adventures you don’t want to miss.',
  },
  transport: {
    emojis: ['✈️', '🧳'],
    subtext: 'Start saving flights, trains, and the way you’ll get there.',
  },
  food: {
    emojis: ['🍔', '🍜'],
    subtext: 'Start saving restaurants and dishes you don’t want to miss.',
  },
  default: {
    emojis: ['✨', '💡'],
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
// reads as the same color on every screen, regardless of join order.
export function colorForName(name) {
  if (!name) return MEMBER_COLORS[0]
  return MEMBER_COLORS[hashString(name) % MEMBER_COLORS.length]
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
