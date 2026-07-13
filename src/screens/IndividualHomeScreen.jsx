import { useState } from 'react'
import { TEXT, COLORS, SPACING, SHADOW_CARD } from '../styles'

export function IndividualHomeScreen({ navigate, userName, myIdeas, currentTrip, openTrip, allCategories, addCustomCategory }) {
  const [ideasOpen, setIdeasOpen]       = useState(false)
  const [addingSection, setAddingSection] = useState(false)
  const [sectionName, setSectionName]   = useState('')

  const initial = userName ? userName.charAt(0).toUpperCase() : '?'
  const totalItems = allCategories.reduce((sum, cat) => sum + (myIdeas[cat.id] || []).length, 0)

  const handleAddSection = () => {
    if (!sectionName.trim()) return
    addCustomCategory(sectionName.trim())
    setSectionName('')
    setAddingSection(false)
  }

  return (
    <div className="screen" style={{ background: COLORS.bgMyIdeas }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ ...TEXT.greeting, marginBottom: 2 }}>
            Hello, {userName} 👋
          </p>
          <h1 style={TEXT.appName}>
            TripTogether
          </h1>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: COLORS.terracotta,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: 'white',
          boxShadow: `0 2px 10px ${COLORS.terracotta}4D`,
        }}>
          {initial}
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: `4px ${SPACING.screenX}px ${SPACING.scrollBottomPad}px` }}>

        {/* My Ideas collapsible card — terracotta accent border signals "this is yours" */}
        <div style={{ marginBottom: SPACING.sectionGap }}>
          <p style={{ ...TEXT.sectionHeading, marginBottom: SPACING.headingGap }}>
            My Ideas
          </p>

          <div style={{
            background: COLORS.cardBg, borderRadius: 14,
            boxShadow: SHADOW_CARD,
            borderLeft: `3px solid ${COLORS.terracotta}`,
            overflow: 'hidden',
          }}>
            {/* Card header — always visible */}
            <button
              onClick={() => setIdeasOpen(o => !o)}
              style={{
                width: '100%', border: 'none', background: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', padding: '16px 16px',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 18, marginRight: 12 }}>💡</span>
              <span style={{ flex: 1, ...TEXT.cardTitle }}>My Ideas</span>
              <span style={{
                fontSize: 12, fontWeight: 600, color: COLORS.warmGrey,
                background: COLORS.sand, borderRadius: 20, padding: '3px 10px', marginRight: 10,
              }}>
                {totalItems} saved
              </span>
              <span style={{
                fontSize: 18, color: COLORS.warmGrey,
                display: 'inline-block',
                transform: ideasOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}>›</span>
            </button>

            {/* Expandable body */}
            {ideasOpen && (
              <>
                <div style={{ height: 1, background: COLORS.borderLight }} />
                {allCategories.map((cat, i) => {
                  const count = (myIdeas[cat.id] || []).length
                  return (
                    <button
                      key={cat.id}
                      onClick={() => navigate('myIdeasCategory', { categoryId: cat.id, backTo: 'individualHome' })}
                      style={{
                        width: '100%', border: 'none', background: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '15px 16px', textAlign: 'left',
                        borderBottom: i < allCategories.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none',
                      }}
                    >
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: `${cat.color}2A`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 17, flexShrink: 0,
                      }}>
                        {cat.icon}
                      </div>
                      <span style={{ ...TEXT.categoryRowName, flex: 1 }}>
                        {cat.label}
                      </span>
                      <span style={{ fontSize: 13, color: COLORS.warmGrey, marginRight: 6 }}>
                        {count === 0 ? '—' : count}
                      </span>
                      <span style={{ fontSize: 15, color: '#D6CCBF' }}>›</span>
                    </button>
                  )
                })}

                {/* Add a section */}
                <div style={{ borderTop: `1px solid ${COLORS.borderLight}`, padding: '8px 16px 12px' }}>
                  {!addingSection ? (
                    <button
                      onClick={() => setAddingSection(true)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 13, color: COLORS.teal, fontWeight: 600, padding: '6px 0',
                      }}
                    >
                      <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
                      Add a section
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
                      <input
                        autoFocus
                        value={sectionName}
                        onChange={e => setSectionName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAddSection(); if (e.key === 'Escape') { setAddingSection(false); setSectionName('') } }}
                        placeholder="Section name…"
                        style={{
                          flex: 1, height: 40, borderRadius: 10,
                          border: `1.5px solid ${COLORS.teal}`,
                          padding: '0 12px', fontSize: 14, color: COLORS.charcoal,
                          background: COLORS.bgMyIdeas, fontFamily: 'inherit',
                        }}
                      />
                      <button
                        onClick={handleAddSection}
                        disabled={!sectionName.trim()}
                        style={{
                          background: sectionName.trim() ? COLORS.teal : COLORS.border,
                          color: sectionName.trim() ? 'white' : '#A79E93',
                          border: 'none', borderRadius: 10, padding: '0 14px',
                          fontSize: 13, fontWeight: 700, cursor: sectionName.trim() ? 'pointer' : 'default',
                          flexShrink: 0,
                        }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => { setAddingSection(false); setSectionName('') }}
                        style={{
                          background: 'none', border: 'none', color: COLORS.warmGrey,
                          fontSize: 20, cursor: 'pointer', padding: '0 4px', flexShrink: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Trip summary card — shown once a group trip exists */}
        {currentTrip && (
          <div style={{
            background: COLORS.cardBg, borderRadius: 14, padding: 20,
            boxShadow: SHADOW_CARD, marginBottom: SPACING.sectionGap,
          }}>
            <p style={{ ...TEXT.sectionHeading, marginBottom: 6 }}>Your trip</p>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.3, marginBottom: 6 }}>
              {currentTrip.name}
            </h3>
            <p style={{
              fontSize: 13, fontWeight: 400, marginBottom: 16,
              color: (currentTrip.destination || currentTrip.dates) ? COLORS.warmGrey : '#B5AA9C',
              fontStyle: (currentTrip.destination || currentTrip.dates) ? 'normal' : 'italic',
            }}>
              {[currentTrip.destination && `📍 ${currentTrip.destination}`, currentTrip.dates && `📅 ${currentTrip.dates}`].filter(Boolean).join('   ') || 'No destination or dates yet'}
            </p>

            {currentTrip.members && currentTrip.members.length > 0 && (
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
                {currentTrip.members.map(m => (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', background: m.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: 'white',
                    }}>
                      {m.initial}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.warmGrey }}>{m.name}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => openTrip(currentTrip.id)}
              style={{
                width: '100%', minHeight: SPACING.buttonMinHeight, borderRadius: 12, border: 'none',
                background: COLORS.teal, color: 'white',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Open trip
            </button>
          </div>
        )}

        {/* Plan a trip together card — exciting invitation, subtle dot texture */}
        <div style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1.4px) 0 0/16px 16px, linear-gradient(140deg, ${COLORS.teal} 0%, ${COLORS.tealLight} 100%)`,
          borderRadius: 20, padding: '24px 20px',
          boxShadow: `0 6px 24px ${COLORS.teal}48`,
        }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>
            Ready to collaborate?
          </p>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: -0.4, marginBottom: 8, lineHeight: 1.2 }}>
            Plan a trip together
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.55, marginBottom: 20, fontWeight: 500 }}>
            Bring your ideas together with your travel crew.
          </p>
          <button
            onClick={() => navigate('createTrip')}
            style={{
              background: 'white', color: COLORS.teal, border: 'none',
              borderRadius: 12, minHeight: SPACING.buttonMinHeight, padding: '0 22px',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              letterSpacing: -0.2,
            }}
          >
            Create a Group Trip
          </button>
        </div>
      </div>
    </div>
  )
}
