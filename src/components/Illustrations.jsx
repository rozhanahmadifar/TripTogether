import myTripsGroupUrl from '../assets/illustrations/my-trips-group.svg'
import aiRobotUrl from '../assets/illustrations/ai-robot.svg'
import discussTravelBubblesUrl from '../assets/illustrations/discuss-travel-bubbles.svg'

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

// Group Discussions empty state — three overlapping speech bubbles, each
// holding one travel icon (plane, map pin, suitcase) instead of text, so
// the illustration reads as "a conversation about a trip" without a
// literal meeting/whiteboard scene or any human figures. Hand-built from
// simple flat shapes — the same kind of icon glyph already used
// throughout this app (PlaneIcon, ChevronIcon, etc.) rather than a
// character illustration — in the app's own palette.
export function DiscussEmptyIllustration({ size = 120 }) {
  return <img src={discussTravelBubblesUrl} alt="" width={size} height={size * 0.85} style={{ display: 'block' }} />
}
