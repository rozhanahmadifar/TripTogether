import { COLORS } from '../styles'

// A soft, irregular blob backdrop shared by both intro illustrations below —
// rather than a plain circle, it reads as a deliberate illustration
// background instead of a placeholder shape.
function Blob({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ position: 'absolute', top: 0, left: 0 }}>
      <path
        d="M60 8c17 0 27 12 34 26 7 14 14 28 6 42-8 14-26 18-42 22-16 4-33 2-42-12S6 51 14 35 43 8 60 8Z"
        fill={color}
      />
    </svg>
  )
}

// My Trips empty state — a suitcase (the trip itself), a camera and a
// plant peeking out beside it (the memories and small joys packed along
// with it), and a paper plane trailing off to signal "somewhere new" —
// replacing the old two-emoji placeholder with one cohesive scene.
export function TripsEmptyIllustration({ size = 120 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <Blob color={COLORS.sand} size={size} />
      <svg width={size} height={size} viewBox="0 0 120 120" style={{ position: 'relative' }}>
        {/* Plant, tucked behind the suitcase's left edge */}
        <rect x="24" y="70" width="18" height="16" rx="3" fill={COLORS.terracotta} />
        <path d="M33 70c-2-9-9-13-15-14 2 8 8 13 15 14Z" fill={COLORS.milestone} />
        <path d="M33 70c1-10 8-15 15-17-1 9-7 15-15 17Z" fill={COLORS.milestone} />
        {/* Suitcase body */}
        <rect x="38" y="42" width="46" height="40" rx="7" fill={COLORS.teal} />
        <rect x="52" y="34" width="18" height="10" rx="4" fill="none" stroke={COLORS.teal} strokeWidth="4" />
        <rect x="38" y="58" width="46" height="4" fill="rgba(255,255,255,0.35)" />
        <circle cx="48" cy="86" r="3.5" fill={COLORS.charcoal} />
        <circle cx="74" cy="86" r="3.5" fill={COLORS.charcoal} />
        {/* Camera, propped against the suitcase's front */}
        <rect x="66" y="66" width="30" height="22" rx="5" fill="#F3E9DA" stroke={COLORS.warmGrey} strokeWidth="1.5" />
        <rect x="76" y="61" width="10" height="7" rx="2" fill="#F3E9DA" stroke={COLORS.warmGrey} strokeWidth="1.5" />
        <circle cx="81" cy="77" r="7" fill="white" stroke={COLORS.charcoal} strokeWidth="2" />
        <circle cx="81" cy="77" r="3" fill={COLORS.charcoal} />
        {/* Paper plane, trailing a dashed path up and away */}
        <path d="M78 30c8-6 16-11 22-12" stroke={COLORS.terracotta} strokeWidth="2" strokeDasharray="3 4" fill="none" strokeLinecap="round" />
        <path d="M96 12 86 17l3 4 3-2 1 4 3-11Z" fill={COLORS.terracotta} />
      </svg>
    </div>
  )
}

// Ask the AI intro — a small friendly robot mascot (waving, one raised
// antenna) with a location-pin speech bubble beside it, standing in for
// "ask me anything, including where things are" without literal text.
export function AIIntroIllustration({ size = 120 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <Blob color={COLORS.tealTint} size={size} />
      <svg width={size} height={size} viewBox="0 0 120 120" style={{ position: 'relative' }}>
        {/* Motion lines — a small wave/greeting gesture */}
        <path d="M22 46l6 6M18 58h9M23 70l6-5" stroke={COLORS.terracotta} strokeWidth="3" strokeLinecap="round" />
        {/* Robot body (peeking hands) */}
        <rect x="40" y="84" width="12" height="10" rx="5" fill={COLORS.teal} />
        <rect x="66" y="84" width="12" height="10" rx="5" fill={COLORS.teal} />
        {/* Robot head */}
        <rect x="36" y="42" width="46" height="42" rx="18" fill="white" stroke={COLORS.charcoal} strokeWidth="2" />
        <circle cx="59" cy="34" r="4" fill={COLORS.terracotta} />
        <line x1="59" y1="38" x2="59" y2="42" stroke={COLORS.charcoal} strokeWidth="2" />
        <ellipse cx="49" cy="60" rx="4" ry="5" fill={COLORS.teal} />
        <ellipse cx="71" cy="60" rx="4" ry="5" fill={COLORS.teal} />
        <path d="M50 71c4 4 14 4 18 0" stroke={COLORS.charcoal} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Speech bubble with a location pin */}
        <path d="M78 20h26a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H93l-6 7v-7h-9a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6Z" fill={COLORS.sand} />
        <path d="M91 26c-3.5 0-6 2.6-6 5.8 0 4.3 6 9.7 6 9.7s6-5.4 6-9.7c0-3.2-2.5-5.8-6-5.8Z" fill={COLORS.terracotta} />
        <circle cx="91" cy="31.5" r="2.2" fill="white" />
      </svg>
    </div>
  )
}
