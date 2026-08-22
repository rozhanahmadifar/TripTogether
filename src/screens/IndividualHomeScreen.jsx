import { COLORS, SPACING, tripCardBackground } from '../styles'
import { PLAN_TOGETHER_PHOTO, MY_IDEAS_PHOTO, CATEGORY_PHOTOS } from '../data'

// One explicit type scale for the whole screen — header included — so every
// text element traces to a deliberate tier instead of a hand-typed one-off
// size. Six tiers, each with one clear job:
//   DISPLAY   28/800            — the "TripTogether" wordmark, once per screen
//   HEADLINE  19/800            — each card's main headline
//   BODY      14/500            — descriptions, metadata lines, the greeting
//   CAPTION   12/500            — the tagline — one deliberate step below BODY
//   LABEL     11/700 uppercase  — eyebrow tags, the status pill, the percent
//   BUTTON    15/600            — every button label
const DISPLAY = { fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.05 }
const HEADLINE = { fontSize: 19, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.2 }
const BODY = { fontSize: 14, fontWeight: 500, lineHeight: 1.45 }
const CAPTION = { fontSize: 12, fontWeight: 500, lineHeight: 1.4 }
const LABEL = { fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }
const BUTTON = { fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }

export function IndividualHomeScreen({ navigate, userName, myIdeas, currentTrip, openTrip, groupItems = [], allCategories = [] }) {
  const initial = userName ? userName.charAt(0).toUpperCase() : '?'
  const totalItems = myIdeas.length

  // Same "decided categories" metric GroupHomeScreen already computes —
  // reused here, not reinvented, so the percentage shown on this compact
  // card always agrees with the real one inside the trip.
  const visibleCategories = allCategories.filter(c => !c.hidden && !(c.id === 'destination' && currentTrip?.destinationSetAtCreation))
  const decidedCount = visibleCategories.filter(cat =>
    groupItems.some(i => i.categoryIds.includes(cat.id) && (i.starredBy || []).length > 0)
  ).length
  const totalCategories = visibleCategories.length
  const percent = totalCategories > 0 ? Math.round((decidedCount / totalCategories) * 100) : 0

  return (
    <div className="screen" style={{ background: COLORS.bgMyIdeas }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ ...BODY, color: COLORS.warmGrey, marginBottom: 6 }}>
            Hello, {userName} 👋
          </p>
          <h1 style={{ ...DISPLAY, color: COLORS.teal, marginBottom: 4 }}>
            TripTogether
          </h1>
          <p style={{ ...CAPTION, color: COLORS.warmGrey }}>
            Plan better trips, together.
          </p>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: COLORS.terracotta,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1,
          boxShadow: `0 2px 10px ${COLORS.terracotta}4D`, flexShrink: 0,
        }}>
          {initial}
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: `4px ${SPACING.screenX}px ${SPACING.scrollBottomPad}px` }}>

        {/* My Ideas — a light, paper-toned card (dark text, a lock mark, the
            actual photo showing through clearly) rather than a moody dark
            scrim, matching the reference's "journal" feel for a private,
            personal space — distinct from the group cards below, which stay
            bold/photo-forward since they're collaborative. The overlay is a
            horizontal (not diagonal) fade — opacity depends only on how far
            right you are, not on vertical position too — so every line of
            text sits fully inside the opaque zone regardless of how long it
            runs, instead of the longest line drifting into a faded patch. */}
        <button
          onClick={() => navigate('myIdeasFull', { backTo: 'individualHome' })}
          style={{
            width: '100%', border: `1px solid ${COLORS.borderLight}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
            position: 'relative',
            backgroundImage: [
              `linear-gradient(90deg, rgba(253,247,238,0.97) 0%, rgba(253,247,238,0.95) 48%, rgba(253,247,238,0.55) 65%, rgba(253,247,238,0.15) 100%)`,
              `url("${MY_IDEAS_PHOTO}")`,
            ].join(', '),
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center 38%',
            backgroundRepeat: 'no-repeat, no-repeat',
            backgroundColor: COLORS.bgMyIdeas,
            borderRadius: 20, padding: '22px 20px 28px',
            marginBottom: SPACING.cardGap,
            boxShadow: '0 4px 16px rgba(26,18,12,0.08)',
          }}
        >
          <p style={{ ...LABEL, color: COLORS.terracotta, marginBottom: 8 }}>
            🔒 My ideas
          </p>
          <h3 style={{ ...HEADLINE, color: COLORS.charcoal, marginBottom: 8 }}>
            {totalItems === 0 ? 'Nothing saved yet' : `${totalItems} saved`}
          </h3>
          <p style={{ ...BODY, color: COLORS.warmGrey }}>
            Tap to browse or save something new
          </p>
          <span style={{
            position: 'absolute', top: 22, right: 20,
            width: 34, height: 34, borderRadius: '50%',
            background: 'white',
            boxShadow: '0 1px 4px rgba(26,18,12,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Reuses the exact same chevron shape as BackButton.jsx
                (mirrored), on a square 24x24 viewBox — the previous 9x14
                hand-picked box wasn't truly symmetric, which read as
                off-center no matter how the flex alignment was tuned. A
                square viewBox with the zigzag running corner-to-corner is
                centered by construction. */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke={COLORS.terracotta} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        {/* Create a Group — always present, trip or no trip, since starting
            another trip is a real, supported action (MyTripsScreen also has
            its own entry point for this). A real minimum height plus two
            equal flexible spacers around the button center it in the space
            below the text, instead of the button just hugging the copy. */}
        <div style={{
          ...tripCardBackground(PLAN_TOGETHER_PHOTO),
          borderRadius: 20, padding: '20px 20px',
          marginBottom: SPACING.cardGap, minHeight: 196,
          boxShadow: `0 4px 16px ${COLORS.teal}28`,
          display: 'flex', flexDirection: 'column',
        }}>
          <div>
            <p style={{ ...LABEL, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
              Ready to collaborate?
            </p>
            <h3 style={{ ...HEADLINE, color: 'white', marginBottom: 8 }}>
              Plan a trip together
            </h3>
            <p style={{ ...BODY, color: 'rgba(255,255,255,0.78)' }}>
              Bring your ideas together with your travel crew.
            </p>
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => navigate('createTrip')}
            style={{
              width: '100%', background: 'white', color: COLORS.teal, border: 'none',
              borderRadius: 12, minHeight: SPACING.buttonMinHeight, padding: '0 22px',
              ...BUTTON, cursor: 'pointer',
            }}
          >
            Create a Group Trip
          </button>
          <div style={{ flex: 1 }} />
        </div>

        {/* Current Trip — a compact white summary row instead of a
            full-bleed photo hero: eyebrow, name, dates/member-count line,
            a real decided-categories progress bar, and a square photo
            thumbnail rather than the photo filling or stretching across
            the whole card. Padding, border, and rhythm now match the
            polish level of the two photo cards above it. The whole row is
            the tap target, same pattern as My Ideas. */}
        {currentTrip && (
          <button
            onClick={() => openTrip(currentTrip.id)}
            style={{
              width: '100%', border: `1px solid ${COLORS.borderLight}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              background: COLORS.cardBg, borderRadius: 20, padding: '16px 18px',
              boxShadow: '0 4px 16px rgba(26,18,12,0.10)',
            }}
          >
            {/* "Your trip" sits above the row entirely (not inside the
                text column) — so the row's only two children are the text
                column and the photo, and the photo's top naturally lines
                up with the trip title instead of with this label. */}
            <p style={{ ...LABEL, color: COLORS.teal, marginBottom: 7 }}>
              Your trip
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  ...HEADLINE, color: COLORS.charcoal, marginBottom: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {currentTrip.name}
                </h3>
                {/* Destination on its own line first, then dates/members
                    on a second line below it — a dot only ever separates
                    two things sharing a line, never stands in for a line
                    break. Dates/members still wrap segment-aware (each
                    part its own `whiteSpace: 'nowrap'` span) so a number
                    never splits from its unit word. The bullet itself gets
                    real horizontal margin (not just a literal space
                    character either side) so "dates • members" reads with
                    genuine breathing room, not crowded together. */}
                {currentTrip.destination && (
                  <p style={{ ...BODY, color: COLORS.warmGrey, marginBottom: 5 }}>
                    {currentTrip.destination}
                  </p>
                )}
                {currentTrip.dates && (
                  <p style={{ ...BODY, color: COLORS.warmGrey, marginBottom: currentTrip.members?.length ? 2 : 0 }}>
                    {currentTrip.dates}
                  </p>
                )}
                {currentTrip.members?.length > 0 && (
                  <p style={{ ...BODY, color: COLORS.warmGrey }}>
                    {currentTrip.members.length} {currentTrip.members.length === 1 ? 'member' : 'members'}
                  </p>
                )}
                {!currentTrip.destination && !currentTrip.dates && !(currentTrip.members?.length > 0) && (
                  <p style={{ ...BODY, color: COLORS.warmGrey }}>
                    No destination or dates yet
                  </p>
                )}
                {/* Status pill + progress bar + percentage — back inside
                    the text column (not a full-width row below the photo),
                    so it renders right after the meta line instead of
                    waiting on the photo to clear, and it's naturally
                    capped to the text column's width instead of running
                    under the photo. Bar fill uses COLORS.milestone (not
                    the brand teal) — that token is explicitly reserved in
                    styles.js for progress/completion moments like this. */}
                {totalCategories > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, color: COLORS.teal, background: COLORS.tealTint,
                      borderRadius: 999, padding: '4px 10px', flexShrink: 0, whiteSpace: 'nowrap',
                    }}>
                      {decidedCount === totalCategories ? 'All set!' : 'In progress'}
                    </span>
                    <div style={{ flex: 1, height: 6, background: COLORS.borderLight, borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: COLORS.milestone, borderRadius: 999 }} />
                    </div>
                    <span style={{ ...BODY, color: COLORS.warmGrey, flexShrink: 0 }}>{percent}%</span>
                  </div>
                )}
              </div>
              {currentTrip.destination && (
                <img
                  src={CATEGORY_PHOTOS.destination}
                  alt=""
                  style={{ width: 96, height: 132, borderRadius: 16, objectFit: 'cover', flexShrink: 0, marginTop: -6 }}
                />
              )}
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
