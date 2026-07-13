const themes = {
  cliff:    { grad: ['#3a6a8a', '#1e3f5f'], emoji: '🏔️' },
  cafe:     { grad: ['#7a5540', '#4a3020'], emoji: '☕' },
  pub:      { grad: ['#2d5a28', '#193815'], emoji: '🍺' },
  cottage:  { grad: ['#4a7a58', '#2a4f38'], emoji: '🏡' },
  apt:      { grad: ['#3a5680', '#20406a'], emoji: '🏙️' },
  manor:    { grad: ['#6a4a88', '#422a68'], emoji: '🏰' },
  glamping: { grad: ['#2a5858', '#153838'], emoji: '⛺' },
}

export function ItemImage({ type, height = 80 }) {
  const t = themes[type] || { grad: ['#8a7560', '#5a4a38'], emoji: '📷' }
  return (
    <div style={{
      width: '100%',
      height,
      background: `linear-gradient(155deg, ${t.grad[0]} 0%, ${t.grad[1]} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: height * 0.32,
      flexShrink: 0,
    }}>
      {t.emoji}
    </div>
  )
}
