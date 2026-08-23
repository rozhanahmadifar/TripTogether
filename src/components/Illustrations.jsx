import myTripsGroupUrl from '../assets/illustrations/my-trips-group.svg'
import aiRobotUrl from '../assets/illustrations/ai-robot.svg'
import { COLORS } from '../styles'
import { CATEGORY_PHOTOS, DISCUSS_EMPTY_PHOTO } from '../data'

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

// Group Discussions empty state — two overlapping real trip photos (a
// collage of "the places you'll talk about"), with a chat bubble and a
// people icon overhead standing in for "conversation" without needing
// literal text. Built from live elements rather than a flat illustration
// since it needs to show real photos, not vector art.
export function DiscussEmptyIllustration({ size = 150 }) {
  const s = size / 150
  const px = (n) => n * s

  return (
    <div style={{ position: 'relative', width: size, height: px(128) }}>
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: size, height: size, borderRadius: '48% 52% 45% 55%',
        background: COLORS.tealTint,
      }} />

      <div style={{
        position: 'absolute', top: px(6), left: px(10),
        width: px(38), height: px(38), borderRadius: '50%',
        background: COLORS.sand, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width={px(20)} height={px(20)} viewBox="0 0 24 24" fill="none" stroke={COLORS.terracotta} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.35 0-2.62-.32-3.75-.9L3 20l1.05-4.2A8.44 8.44 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3h1A8.5 8.5 0 0 1 21 11.5Z" />
        </svg>
      </div>

      <div style={{
        position: 'absolute', top: 0, left: px(58),
        width: px(44), height: px(44), borderRadius: '50%',
        background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <svg width={px(22)} height={px(22)} viewBox="0 0 24 24" fill="none" stroke={COLORS.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M15.5 14.2c2.4.5 4.5 2.6 4.5 5.8" />
        </svg>
      </div>

      <img
        src={CATEGORY_PHOTOS.destination}
        alt=""
        style={{
          position: 'absolute', top: px(46), left: px(14),
          width: px(70), height: px(70), objectFit: 'cover',
          borderRadius: px(10), border: `${px(3)}px solid white`,
          boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          transform: 'rotate(-8deg)',
        }}
      />
      <img
        src={DISCUSS_EMPTY_PHOTO}
        alt=""
        style={{
          position: 'absolute', top: px(38), left: px(64),
          width: px(70), height: px(70), objectFit: 'cover',
          borderRadius: px(10), border: `${px(3)}px solid white`,
          boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          transform: 'rotate(7deg)',
        }}
      />

      {/* Small leaf sprig, tucked behind the bottom-right corner of the
          photo stack — an echo of the same motif on My Trips' illustration. */}
      <svg
        width={px(24)} height={px(24)} viewBox="0 0 24 24"
        style={{ position: 'absolute', top: px(96), left: px(120) }}
      >
        <path d="M12 22c-8-2-10-9-9-16 7 0 13 4 9 16Z" fill={COLORS.milestone} />
        <path d="M12 22c1-7 4-11 9-14" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
      </svg>
    </div>
  )
}
