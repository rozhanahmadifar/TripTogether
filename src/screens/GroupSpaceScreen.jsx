import { useState } from 'react'
import { TEXT, COLORS, SPACING, SHADOW_CARD } from '../styles'

export function GroupSpaceScreen({ navigate, currentTrip, groupItems, allCategories, addCustomCategory }) {
  const tripMembers = currentTrip?.members || []
  const [addingSection, setAddingSection] = useState(false)
  const [sectionName, setSectionName]     = useState('')

  const getContributors = (categoryId) => {
    const items = groupItems[categoryId] || []
    return [...new Set(items.map(i => i.savedBy))]
  }

  const handleAddSection = () => {
    if (!sectionName.trim()) return
    addCustomCategory(sectionName.trim())
    setSectionName('')
    setAddingSection(false)
  }

  return (
    <div className="screen" style={{ background: COLORS.bgGroupSpace }}>
      <div style={{ padding: '20px 20px 16px', background: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
        <p style={{ ...TEXT.subtext, marginBottom: 3 }}>
          {currentTrip ? currentTrip.name : 'Group'}
        </p>
        <h1 style={TEXT.screenTitle}>
          Group Space
        </h1>
        <p style={{ ...TEXT.subtext, marginTop: 4 }}>
          Everyone in the group can see these
        </p>
      </div>

      <div className="screen-scroll" style={{ padding: `16px ${SPACING.screenX}px ${SPACING.scrollBottomPad}px` }}>
        <div style={{
          background: COLORS.cardBg, borderRadius: 16, overflow: 'hidden',
          boxShadow: SHADOW_CARD,
        }}>
          {allCategories.map((cat, i) => {
            const contributors = getContributors(cat.id)
            const count = (groupItems[cat.id] || []).length
            return (
              <button
                key={cat.id}
                onClick={() => navigate('groupCategory', { categoryId: cat.id, backTo: 'groupSpace' })}
                style={{
                  width: '100%', border: 'none', background: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 16px', textAlign: 'left',
                  borderBottom: `1px solid ${COLORS.borderLight}`,
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: `${cat.color}2A`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>
                  {cat.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={TEXT.categoryRowName}>
                    {cat.label}
                  </p>
                  <p style={{ ...TEXT.categoryRowSubtext, marginTop: 2 }}>
                    {count === 0 ? 'Nothing added yet' : `${count} ${count === 1 ? 'item' : 'items'}`}
                  </p>
                </div>

                {contributors.length > 0 && (
                  <div style={{ display: 'flex', marginRight: 4 }}>
                    {contributors.slice(0, 4).map((name, idx) => {
                      const member = tripMembers.find(m => m.name === name)
                      return (
                        <div key={idx} style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: member?.color || COLORS.terracotta,
                          border: '2px solid white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, fontWeight: 700, color: 'white',
                          marginLeft: idx > 0 ? -7 : 0,
                        }}>
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )
                    })}
                  </div>
                )}

                <span style={{ fontSize: 16, color: '#D6CCBF' }}>›</span>
              </button>
            )
          })}

          {/* Add a section */}
          <div style={{ padding: '8px 16px 12px' }}>
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
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddSection()
                    if (e.key === 'Escape') { setAddingSection(false); setSectionName('') }
                  }}
                  placeholder="Section name…"
                  style={{
                    flex: 1, height: 40, borderRadius: 10,
                    border: `1.5px solid ${COLORS.teal}`,
                    padding: '0 12px', fontSize: 14, color: COLORS.charcoal,
                    background: COLORS.bgGroupSpace, fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={handleAddSection}
                  disabled={!sectionName.trim()}
                  style={{
                    background: sectionName.trim() ? COLORS.teal : COLORS.border,
                    color: sectionName.trim() ? 'white' : '#A79E93',
                    border: 'none', borderRadius: 10, padding: '0 14px',
                    fontSize: 13, fontWeight: 700,
                    cursor: sectionName.trim() ? 'pointer' : 'default', flexShrink: 0,
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => { setAddingSection(false); setSectionName('') }}
                  style={{ background: 'none', border: 'none', color: COLORS.warmGrey, fontSize: 20, cursor: 'pointer', padding: '0 4px', flexShrink: 0 }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
