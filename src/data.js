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

export const MEMBER_COLORS = ['#1E5F5F', '#D4724A', '#6BAE8A', '#5B8DBE', '#9B8AC4', '#E8B84A']

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
