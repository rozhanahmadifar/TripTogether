import { COLORS } from '../styles'

export function PencilIcon({ size = 16, color = COLORS.charcoal }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.83 2.83 0 0 1 4 4L7 21l-4 1 1-4Z" />
    </svg>
  )
}

export function PlusIcon({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  )
}

export function TrashIcon({ size = 16, color = COLORS.danger }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

// Small floating menu anchored above the element whose bounding rect is passed in.
// Positioned with `fixed` (viewport-relative) so it escapes ancestor overflow clipping.
export function ActionMenu({ anchorRect, rows, onClose }) {
  if (!anchorRect) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 300 }}
      />
      <div
        style={{
          position: 'fixed',
          top: anchorRect.top - 8,
          left: anchorRect.left + anchorRect.width / 2,
          transform: 'translate(-50%, -100%)',
          background: 'white', borderRadius: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          overflow: 'hidden', zIndex: 301, minWidth: 172,
        }}
      >
        {rows.map((row, i) => (
          <button
            key={i}
            onClick={row.onClick}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', background: 'none', border: 'none',
              borderTop: i > 0 ? `1px solid ${COLORS.borderLight}` : 'none',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            }}
          >
            {row.icon}
            <span style={{ fontSize: 14, fontWeight: 600, color: row.color }}>{row.label}</span>
          </button>
        ))}
      </div>
    </>
  )
}
