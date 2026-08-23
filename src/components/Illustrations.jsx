import myTripsGroupUrl from '../assets/illustrations/my-trips-group.svg'
import aiRobotUrl from '../assets/illustrations/ai-robot.svg'
import discussConversationUrl from '../assets/illustrations/discuss-conversation.svg'

// My Trips empty state — a group of friends (not a solo traveler) with a
// suitcase and a plane trailing overhead, sourced from Storyset's "Group
// photo" and "Departing" illustrations and recolored to the app palette.
export function TripsEmptyIllustration({ size = 120 }) {
  return <img src={myTripsGroupUrl} alt="" width={size} height={size} style={{ display: 'block' }} />
}

// Ask the AI intro — Storyset's "Chat bot" robot with its phone-mockup and
// gear-icon layers removed, recolored to the app palette.
export function AIIntroIllustration({ size = 120 }) {
  return <img src={aiRobotUrl} alt="" width={size} height={size} style={{ display: 'block' }} />
}

// Group Discussions empty state — Storyset's "Discussion" illustration
// (two people talking over a table, with floating speech-bubble icons),
// same declutter-and-recolor treatment as the other two illustrations, so
// all three empty states share one consistent linework/color language.
export function DiscussEmptyIllustration({ size = 120 }) {
  return <img src={discussConversationUrl} alt="" width={size} height={size} style={{ display: 'block' }} />
}
