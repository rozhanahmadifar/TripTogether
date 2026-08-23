import myTripsGroupUrl from '../assets/illustrations/my-trips-group.svg'
import aiRobotUrl from '../assets/illustrations/ai-robot.svg'
import discussFriendsTalkingUrl from '../assets/illustrations/discuss-friends-talking.svg'

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

// Group Discussions empty state — Storyset's "People talking" illustration
// (three friends casually chatting, drinks in hand — not office attire)
// with one of its two plants swapped for the same suitcase asset used on
// My Trips, plus the same trailing paper plane from that illustration's
// sky, so it reads as friends catching up about a trip rather than a
// meeting. Same declutter-and-recolor treatment as the other two.
export function DiscussEmptyIllustration({ size = 120 }) {
  return <img src={discussFriendsTalkingUrl} alt="" width={size} height={size} style={{ display: 'block' }} />
}
