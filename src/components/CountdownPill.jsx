import { COLORS } from '../styles'
import { countdownLabel } from '../data'

// The one "X days until departure" pill, shared by the My Trips list card
// and the trip-detail hero card — previously each screen invented its own
// color pairing for this (Sand+Terracotta on the list card, a translucent
// white "glass" scrim on the hero, since the hero's white overlay only read
// as teal because it sat on top of the teal-tinted photo card underneath
// it). This version carries its own teal fill so it reads identically
// regardless of what it's sitting on. `compact` sizes it down for the
// tighter list-card row.
export function CountdownPill({ days, compact = false, style }) {
  const imminent = days <= 7
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: compact ? 5 : 6,
      background: imminent ? COLORS.milestone : `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealLight} 100%)`,
      borderRadius: 20, padding: compact ? '4px 10px' : '6px 12px',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
      flexShrink: 0,
      ...style,
    }}>
      <span style={{ fontSize: compact ? 11 : 13 }}>{days <= 0 ? '✈️' : '📅'}</span>
      <span style={{ fontSize: compact ? 11 : 13, fontWeight: 700, color: 'white', whiteSpace: 'nowrap' }}>
        {countdownLabel(days)}
      </span>
    </div>
  )
}
