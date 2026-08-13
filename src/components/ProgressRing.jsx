// A real circular progress indicator for "X of Y decided" — used on Trip
// Home in place of a plain emoji, so trip progress has one genuine visual
// focal point instead of being conveyed by text alone. Deliberately its own
// small component (not folded into CategoryIcons) since it's driven by a
// fraction, not a category id.
export function ProgressRing({ decided, total, size = 44, strokeWidth = 4, color, trackColor }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = total > 0 ? Math.min(decided / total, 1) : 0
  const dash = circumference * progress

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
      {progress > 0 && (
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
      <text
        x="50%" y="51%" textAnchor="middle" dominantBaseline="central"
        fontSize={size * 0.32} fontWeight="800" fill={color}
        fontFamily="'Plus Jakarta Sans', sans-serif"
      >
        {decided}/{total}
      </text>
    </svg>
  )
}
