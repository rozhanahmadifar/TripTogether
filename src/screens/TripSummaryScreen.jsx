import { COLORS, SPACING, TEXT, SHADOW_CARD } from '../styles'
import { displayTitle } from '../data'
import { BackButton } from '../components/BackButton'

function decidedIn(groupItems, categoryId) {
  return groupItems.filter(i => i.categoryIds.includes(categoryId) && (i.starredBy || []).length > 0)
}

// A decided section gets a warm milestone-tinted card instead of the same
// plain white every section starts with, so filling in the summary reads
// as visible progress rather than a static form that happens to have text
// in it now.
function SummarySection({ icon, label, decided, children }) {
  return (
    <div style={{
      background: decided ? COLORS.milestoneTint : COLORS.cardBg, borderRadius: 16,
      boxShadow: SHADOW_CARD, padding: SPACING.cardPad, marginBottom: SPACING.cardGap,
      border: `1.5px solid ${decided ? COLORS.milestone : 'transparent'}`,
    }}>
      <p style={{
        ...TEXT.sectionHeading, marginBottom: 10,
        color: decided ? COLORS.milestone : COLORS.teal,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ flex: 1 }}>{icon} {label}</span>
        {decided && <span style={{ fontSize: 13 }}>✓</span>}
      </p>
      {children}
    </div>
  )
}

function NotDecided({ text = 'Not decided yet' }) {
  return <p style={{ fontSize: 14, color: COLORS.warmGrey, fontStyle: 'italic' }}>{text}</p>
}

// One decided item reads as plain text; more than one (equally normal for
// a category like Activities) lists every one — no per-category special
// casing, since which categories exist isn't fixed.
function DecidedList({ items }) {
  if (items.length === 0) return <NotDecided />
  if (items.length === 1) {
    return <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal }}>{displayTitle(items[0])}</p>
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items.map(item => (
        <p key={item.id} style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal }}>
          • {displayTitle(item)}
        </p>
      ))}
    </div>
  )
}

export function TripSummaryScreen({ navigate, currentTrip, groupItems, allCategories }) {
  if (!currentTrip) {
    return (
      <div className="screen" style={{ background: COLORS.bg }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
          <BackButton onClick={() => navigate('myTrips')} />
          <h2 style={TEXT.screenTitle}>Trip Summary</h2>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: COLORS.warmGrey }}>No trip selected.</p>
        </div>
      </div>
    )
  }

  // Destination has its own section below (it's the trip's own field, not
  // a category to decide within), and a hidden category stays out of view
  // here too — otherwise every category that exists for this trip gets a
  // section, whatever it's called, never a fixed list of names.
  const summaryCategories = allCategories.filter(c => c.id !== 'destination' && !c.hidden)

  return (
    <div className="screen" style={{ background: COLORS.bg }}>
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
        <BackButton onClick={() => navigate('groupHome')} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ ...TEXT.subtext, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentTrip.name}
          </p>
          <h1 style={TEXT.screenTitle}>Trip Summary</h1>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: `16px ${SPACING.screenX}px ${SPACING.scrollBottomPad}px` }}>
        <SummarySection icon="📍" label="Destination & Dates" decided={!!(currentTrip.destination && currentTrip.dates)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.4, marginBottom: 2 }}>Destination</p>
              {currentTrip.destination
                ? <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal }}>{currentTrip.destination}</p>
                : <NotDecided />}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.4, marginBottom: 2 }}>Dates</p>
              {currentTrip.dates
                ? <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal }}>{currentTrip.dates}</p>
                : <NotDecided text="Not set yet" />}
            </div>
          </div>
        </SummarySection>

        {summaryCategories.map(cat => {
          const items = decidedIn(groupItems, cat.id)
          return (
            <SummarySection key={cat.id} icon={cat.icon} label={cat.label} decided={items.length > 0}>
              <DecidedList items={items} />
            </SummarySection>
          )
        })}

        <SummarySection icon="💰" label="Budget" decided={!!currentTrip.budget}>
          {currentTrip.budget
            ? <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal }}>{currentTrip.budget}</p>
            : <NotDecided text="Not set yet" />}
        </SummarySection>
      </div>
    </div>
  )
}
