export const CATEGORIES = [
  { id: 'inspiration',   icon: '✨', label: 'Inspiration',   color: '#E8B84A' },
  { id: 'destination',   icon: '📍', label: 'Destination',   color: '#5B8DBE' },
  { id: 'accommodation', icon: '🏨', label: 'Accommodation', color: '#6BAE8A' },
  { id: 'activities',    icon: '🎯', label: 'Activities',    color: '#D9805A' },
  { id: 'travel',        icon: '✈️', label: 'Travel',        color: '#9B8AC4' },
]

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
  travel: {
    emojis: ['✈️', '🧳'],
    subtext: 'Start saving flights, trains, and the way you’ll get there.',
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
