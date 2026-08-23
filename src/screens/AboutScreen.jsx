import { COLORS } from '../styles'
import { BackButton } from '../components/BackButton'

export function AboutScreen({ navigate }) {
  return (
    <div className="screen" style={{ background: 'white' }}>
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${COLORS.border}` }}>
        <BackButton onClick={() => navigate('individualHome')} />
      </div>
      <div className="screen-scroll" style={{ padding: '28px 24px 48px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.4, marginBottom: 6 }}>
          About TripTogether
        </h1>
        <p style={{ fontSize: 14, color: COLORS.warmGrey, lineHeight: 1.5, marginBottom: 32, fontWeight: 500 }}>
          Plan better trips, together.
        </p>

        <h2 style={{ fontSize: 13, fontWeight: 700, color: COLORS.charcoal, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>
          Credits
        </h2>
        <p style={{ fontSize: 14, color: COLORS.warmGrey, lineHeight: 1.6, fontWeight: 500 }}>
          Illustrations by{' '}
          <a
            href="https://storyset.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: COLORS.teal, fontWeight: 700, textDecoration: 'underline' }}
          >
            Storyset
          </a>
        </p>
      </div>
    </div>
  )
}
