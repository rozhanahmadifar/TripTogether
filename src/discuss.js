// Fallback only — every trip gets its own pinned thread (named after the
// trip) created in App.startGroupTrip, so this is never shown in normal use.
export const DEFAULT_THREAD = {
  id: 'unknown',
  title: 'Discussion',
  subtext: '',
}

const INTRO_TEMPLATES = [
  'Hey everyone! This is our space for anything that does not need its own topic.',
  'Sounds good, I will drop things here as they come to mind.',
]

const TIMESTAMPS = ['2 hours ago', '1 hour ago']

// Only the pinned (trip-named) thread gets simulated intro messages.
export function buildSimulatedThreadMessages(isPinned, tripMembers) {
  if (!isPinned) return []
  return INTRO_TEMPLATES.slice(0, tripMembers.length).map((text, i) => ({
    id: `sim-pinned-${i}`,
    name: tripMembers[i].name,
    color: tripMembers[i].color,
    initial: tripMembers[i].initial,
    text,
    timestamp: TIMESTAMPS[i] || 'a while ago',
  }))
}
