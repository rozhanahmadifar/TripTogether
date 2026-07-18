import { COLORS } from '../styles'

export function ViewToggle({ view, setView }) {
  const btn = (v, label) => (
    <button
      onClick={() => setView(v)}
      style={{
        border: 'none', cursor: 'pointer', borderRadius: 8, padding: '5px 12px',
        fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
        background: view === v ? COLORS.teal : 'transparent',
        color: view === v ? 'white' : COLORS.warmGrey,
      }}
    >
      {label}
    </button>
  )
  return (
    <div style={{ display: 'flex', gap: 2, background: COLORS.sand, borderRadius: 10, padding: 3, flexShrink: 0 }}>
      {btn('list', 'List')}
      {btn('grid', 'Grid')}
    </div>
  )
}
