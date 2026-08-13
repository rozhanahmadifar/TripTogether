import { COLORS, SPACING } from '../styles'
import { EMPTY_STATE_COPY } from '../data'
import { CategoryIllustration } from './CategoryIcons'

// Empty states should feel like possibility, not emptiness — a real
// illustration (not a floating emoji pair), an encouraging heading, and a
// single inviting action. `color`/`shade` are the category's own two-tone
// pair (see CATEGORIES in data.js); when there's no specific category —
// the cross-category "Nothing decided yet" state — this falls back to the
// brand teal so it still reads as an intentional illustration, not a
// missing-color bug.
export function EmptyState({ categoryId, color = COLORS.teal, shade, heading, subtext, actionLabel, onAction }) {
  const copy = EMPTY_STATE_COPY[categoryId] || EMPTY_STATE_COPY.default

  return (
    <div style={{ textAlign: 'center', padding: '40px 24px 24px' }}>
      {/* `display: flex` here, not `margin: 0 auto` — the illustration is an
          <svg>, which defaults to `display: block` under this app's global
          CSS reset, so a block-level wrapper with no explicit width of its
          own has no extra space for `auto` margins to distribute and the
          illustration was left flush against the text-aligned container's
          actual (left) edge instead of centered. Flex-centering the wrapper
          works regardless of the child's own display type or size. */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
        <CategoryIllustration id={categoryId} color={color} shade={shade || color} />
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
            background: COLORS.action, color: 'white',
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
