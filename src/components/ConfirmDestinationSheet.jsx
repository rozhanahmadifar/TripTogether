import { COLORS } from '../styles'

// Shown once, right when a Destination candidate is first marked as
// decided — turns that category into a "candidates before we decide" list
// that flows naturally into the trip's own committed destination field.
export function ConfirmDestinationSheet({ placeName, onConfirm, onDismiss }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
      }}
      onClick={e => { if (e.target === e.currentTarget) onDismiss() }}
    >
      <div style={{
        background: 'white', borderRadius: 16, padding: 20, width: '100%', maxWidth: 300,
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)', textAlign: 'center',
      }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.charcoal, marginBottom: 6, lineHeight: 1.4 }}>
          Set {placeName} as this trip's destination?
        </p>
        <p style={{ fontSize: 13, color: COLORS.warmGrey, marginBottom: 18, lineHeight: 1.4 }}>
          You just marked it as decided in Destination. This updates the trip's destination field to match.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onDismiss}
            style={{
              flex: 1, minHeight: 44, borderRadius: 10, border: 'none',
              background: COLORS.borderLight, color: COLORS.warmGrey,
              fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Not now
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, minHeight: 44, borderRadius: 10, border: 'none',
              background: COLORS.teal, color: 'white',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Set destination
          </button>
        </div>
      </div>
    </div>
  )
}
