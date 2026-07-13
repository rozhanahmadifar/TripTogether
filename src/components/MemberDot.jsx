import { members } from '../data'

export function MemberDot({ memberId, size = 28, grey = false }) {
  const m = members.find(m => m.id === memberId)
  if (!m) return null
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: grey ? '#d1cdc9' : m.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 700,
        color: 'white',
        flexShrink: 0,
      }}
    >
      {m.initial}
    </div>
  )
}

export function MemberDotRow({ memberIds, size = 26 }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {memberIds.map(id => (
        <MemberDot key={id} memberId={id} size={size} />
      ))}
    </div>
  )
}
