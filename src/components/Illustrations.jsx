import myTripsGroupUrl from '../assets/illustrations/my-trips-group.svg'
import aiRobotUrl from '../assets/illustrations/ai-robot.svg'
import discussGroupChatUrl from '../assets/illustrations/discuss-group-chat.svg'

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

// Group Discussions empty state — Storyset's "Group Chat" illustration
// (three people talking inside a speech-bubble frame) with a suitcase
// composited in at their feet, extracted from the same "Departing" asset
// used on My Trips — the bubble alone read as generic office chat, so the
// suitcase is what actually signals "a trip" is what's being discussed.
// The source asset's own background shape was a heavily white-washed teal
// blob in an odd elongated silhouette — replaced with a plain circle in
// the app's actual tealTint, matching the other two illustrations.
export function DiscussEmptyIllustration({ size = 120 }) {
  return <img src={discussGroupChatUrl} alt="" width={size} height={size} style={{ display: 'block' }} />
}
