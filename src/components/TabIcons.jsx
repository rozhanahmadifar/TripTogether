const ACTIVE_COLOR = '#1E5F5F'
const INACTIVE_COLOR = '#5A5048'

export function HouseIcon({ active, size = 22 }) {
  const color = active ? ACTIVE_COLOR : INACTIVE_COLOR
  if (active) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 3.2 2.6 11h2.65v8.1c0 .5.4.9.9.9H9v-6.3h6V20h2.85c.5 0 .9-.4.9-.9V11h2.65L12 3.2Z" fill={color} />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.2 12 4l9 7.2" />
      <path d="M5.4 9.8V19a1 1 0 0 0 1 1h11.2a1 1 0 0 0 1-1V9.8" />
      <path d="M9.5 20v-6.2h5V20" />
    </svg>
  )
}

export function SuitcaseIcon({ active, size = 22 }) {
  const color = active ? ACTIVE_COLOR : INACTIVE_COLOR
  if (active) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3.2" y="7.5" width="17.6" height="12.3" rx="2.4" fill={color} />
        <rect x="9" y="4" width="6" height="4" rx="1.4" fill={color} />
        <rect x="3.2" y="12.3" width="17.6" height="1.4" fill="white" opacity="0.85" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.2" y="7.5" width="17.6" height="12.3" rx="2.4" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <line x1="3.2" y1="12.6" x2="20.8" y2="12.6" />
    </svg>
  )
}

export function ChatIcon({ active, size = 22 }) {
  const color = active ? ACTIVE_COLOR : INACTIVE_COLOR
  const d = 'M4 5.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9.5L5 20.5V16.5H6a2 2 0 0 1-2-2v-9Z'
  if (active) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d={d} fill={color} />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

export function SparkleIcon({ active, size = 22 }) {
  const color = active ? ACTIVE_COLOR : INACTIVE_COLOR
  const d = 'M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8Z'
  if (active) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d={d} fill={color} />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      <path d={d} />
    </svg>
  )
}
