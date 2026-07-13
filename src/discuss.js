export const GENERAL_THREAD_ID = 'general'

export const DEFAULT_THREAD = {
  id: GENERAL_THREAD_ID,
  title: 'General',
  subtext: "This is your group's general discussion space.",
}

const THREAD_MESSAGE_TEMPLATES = {
  [GENERAL_THREAD_ID]: [
    'Hey everyone! This is our space for anything that does not need its own topic.',
    'Sounds good, I will drop things here as they come to mind.',
  ],
}

const TIMESTAMPS = ['2 hours ago', '1 hour ago']

export function buildSimulatedThreadMessages(threadId, tripMembers) {
  const templates = THREAD_MESSAGE_TEMPLATES[threadId] || []
  return templates.slice(0, tripMembers.length).map((text, i) => ({
    id: `sim-${threadId}-${i}`,
    name: tripMembers[i].name,
    color: tripMembers[i].color,
    initial: tripMembers[i].initial,
    text,
    timestamp: TIMESTAMPS[i] || 'a while ago',
  }))
}
