import { COLORS, SPACING } from '../styles'
import { EMPTY_STATE_COPY } from '../data'

// Empty states should feel like possibility, not emptiness — a warm emoji
// composition, an encouraging heading, and a single inviting action.
export function EmptyState({ categoryId, heading, subtext, actionLabel, onAction }) {
  const copy = EMPTY_STATE_COPY[categoryId] || EMPTY_STATE_COPY.default

  return (
    <div style={{ textAlign: 'center', padding: '48px 24px 24px' }}>
      <div style={{ position: 'relative', width: 112, height: 74, margin: '0 auto 22px' }}>
        <span style={{ fontSize: 64, position: 'absolute', left: 6, top: 0 }}>{copy.emojis[0]}</span>
        <span style={{ fontSize: 46, position: 'absolute', right: 0, bottom: 0 }}>{copy.emojis[1]}</span>
      </div>
      <p style={{ fontSize: 18, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.3, marginBottom: 8 }}>
        {heading}
      </p>
      <p style={{ fontSize: 14, color: COLORS.warmGrey, lineHeight: 1.5, fontWeight: 400, marginBottom: 28, maxWidth: 260, marginLeft: 'auto', marginRight: 'auto' }}>
        {subtext || copy.subtext}
      </p>
      {actionLabel && (
        <button
          onClick={onAction}
          style={{
            minHeight: SPACING.buttonMinHeight, borderRadius: 12, border: 'none',
            background: COLORS.terracotta, color: 'white',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            padding: '0 26px',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
