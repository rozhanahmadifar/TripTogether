import { useState } from 'react'
import { TEXT, COLORS, SPACING, SHADOW_CARD } from '../styles'
import { BackButton } from '../components/BackButton'
import { ActionMenu, PencilIcon, TrashIcon, EyeOffIcon } from '../components/ActionMenu'
import { ItemCard } from '../components/ItemCard'

// Full My Saves list — the "See all" destination from trip home, mirroring
// Group Space's full-list screen (all 6 categories, including empty ones,
// with rename/hide/delete), just themed private instead of shared.
export function MySavesScreen({ navigate, myIdeas, allCategories, addCustomCategory, renameCategory, deleteCategory, toggleCategoryHidden, userName, deleteMyIdea, updateMyIdea }) {
  const [addingSection, setAddingSection] = useState(false)
  const [sectionName, setSectionName]     = useState('')
  const [menuCat, setMenuCat]             = useState(null)
  const [renamingId, setRenamingId]       = useState(null)
  const [renameValue, setRenameValue]     = useState('')
  const [deletingCat, setDeletingCat]     = useState(null)
  const [hiddenOpen, setHiddenOpen]       = useState(false)
  const visibleCategories = allCategories.filter(c => !c.hidden)
  const hiddenCategories = allCategories.filter(c => c.hidden)
  const me = { name: userName || 'You', color: COLORS.teal, initial: (userName || 'You').charAt(0).toUpperCase() }

  // Sections collapse by default once more than 1-2 categories have items —
  // a short list stays open, a long one doesn't dump everything on screen.
  const [expandedIds, setExpandedIds] = useState(() => {
    const withItems = visibleCategories.filter(cat => myIdeas.some(i => i.categoryIds.includes(cat.id)))
    return new Set(withItems.length > 2 ? [] : withItems.map(c => c.id))
  })
  const toggleExpand = (id) => setExpandedIds(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })

  const handleAddSection = () => {
    if (!sectionName.trim()) return
    addCustomCategory(sectionName.trim())
    setSectionName('')
    setAddingSection(false)
  }

  const startRename = (cat) => { setRenamingId(cat.id); setRenameValue(cat.label); setMenuCat(null) }
  const confirmRename = () => {
    if (renameValue.trim()) renameCategory(renamingId, renameValue.trim())
    setRenamingId(null)
  }
  const cancelRename = () => setRenamingId(null)
  const confirmDelete = () => { deleteCategory(deletingCat.id); setDeletingCat(null) }

  return (
    <div className="screen" style={{ background: COLORS.bgMyIdeas }}>
      <div style={{ padding: '16px 20px 16px', background: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <BackButton onClick={() => navigate('groupHome')} />
          <div>
            <p style={{ ...TEXT.subtext, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
              🔒 Private
            </p>
            <h1 style={TEXT.screenTitle}>
              My Saves
            </h1>
          </div>
        </div>
        <p style={{ ...TEXT.subtext, marginTop: 4 }}>
          Only you can see these
        </p>
      </div>

      <div className="screen-scroll" style={{ padding: `16px ${SPACING.screenX}px ${SPACING.scrollBottomPad}px` }}>
        <div style={{
          background: COLORS.cardBg, borderRadius: 16, overflow: 'hidden',
          boxShadow: SHADOW_CARD,
        }}>
          {visibleCategories.map((cat) => {
            const items = myIdeas.filter(item => item.categoryIds.includes(cat.id))
            const isRenaming = renamingId === cat.id
            const isExpanded = expandedIds.has(cat.id)
            return (
              <div key={cat.id} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: `${cat.color}2A`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0, marginLeft: 16,
                  }}>
                    {cat.icon}
                  </div>

                  {isRenaming ? (
                    <div style={{ flex: 1, display: 'flex', gap: 8, padding: '10px 8px 10px 12px' }}>
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') confirmRename(); if (e.key === 'Escape') cancelRename() }}
                        style={{
                          flex: 1, height: 36, borderRadius: 8,
                          border: `1.5px solid ${COLORS.teal}`, padding: '0 10px',
                          fontSize: 14, color: COLORS.charcoal, background: COLORS.bgMyIdeas, fontFamily: 'inherit',
                        }}
                      />
                      <button onClick={confirmRename} style={{ background: COLORS.teal, color: 'white', border: 'none', borderRadius: 8, padding: '0 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Save</button>
                      <button onClick={cancelRename} style={{ background: 'none', border: 'none', color: COLORS.warmGrey, fontSize: 18, cursor: 'pointer', padding: '0 4px' }}>×</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleExpand(cat.id)}
                      style={{
                        flex: 1, border: 'none', background: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '16px 8px 16px 14px', textAlign: 'left', minWidth: 0,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ ...TEXT.categoryRowName, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {cat.label}
                        </p>
                        <p style={{ ...TEXT.categoryRowSubtext, marginTop: 2 }}>
                          {items.length === 0 ? 'Nothing added yet' : `${items.length} ${items.length === 1 ? 'item' : 'items'}`}
                        </p>
                      </div>
                      <span style={{ fontSize: 13, color: '#D6CCBF', flexShrink: 0 }}>{isExpanded ? '▾' : '▸'}</span>
                    </button>
                  )}

                  {!isRenaming && (
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setMenuCat({ cat, anchor: { top: rect.top, left: rect.left, width: rect.width, height: rect.height } })
                      }}
                      style={{
                        border: 'none', background: 'none', cursor: 'pointer',
                        padding: '16px', fontSize: 15, color: '#D6CCBF', flexShrink: 0,
                      }}
                    >
                      ⋯
                    </button>
                  )}
                </div>

                {/* Expanded content — items inline, no navigating away */}
                {isExpanded && (
                  <div style={{ padding: '0 14px 16px' }}>
                    {items.length === 0 ? (
                      <p style={{ fontSize: 13, color: COLORS.warmGrey, fontStyle: 'italic', padding: '4px 0 10px' }}>
                        Nothing added yet.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.cardGap, marginBottom: 10 }}>
                        {items.map(item => (
                          <ItemCard
                            key={item.id}
                            item={item}
                            categories={item.categoryIds.map(id => allCategories.find(c => c.id === id)).filter(Boolean)}
                            contributor={me}
                            source={item.platform}
                            note={item.note}
                            previewHeight={100}
                            allCategories={allCategories}
                            hideFooter
                            onOpen={() => navigate('itemDetail', { itemId: item.id, categoryId: cat.id, backTo: 'mySaves' })}
                            onDelete={() => deleteMyIdea(item.id)}
                            onSave={(updates) => updateMyIdea(item.id, updates)}
                          />
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => navigate('saveSomething', { categoryId: cat.id, backTo: 'mySaves' })}
                      style={{
                        width: '100%', minHeight: 40, background: 'transparent',
                        border: `1.5px dashed #D6CCBF`, borderRadius: 10, cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, color: COLORS.warmGrey,
                      }}
                    >
                      + Save something to {cat.label}
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {menuCat && (
            <ActionMenu
              anchorRect={menuCat.anchor}
              rows={[
                { icon: <PencilIcon />, label: 'Rename', color: COLORS.charcoal, onClick: () => startRename(menuCat.cat) },
                { icon: <EyeOffIcon />, label: 'Hide', color: COLORS.charcoal, onClick: () => { toggleCategoryHidden(menuCat.cat.id); setMenuCat(null) } },
                { icon: <TrashIcon />, label: 'Delete', color: COLORS.danger, onClick: () => { setDeletingCat(menuCat.cat); setMenuCat(null) } },
              ]}
              onClose={() => setMenuCat(null)}
            />
          )}

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

          {/* Hidden categories — collapsed out of the main list, one tap to bring back */}
          {hiddenCategories.length > 0 && (
            <div style={{ borderTop: `1px solid ${COLORS.borderLight}`, padding: '8px 16px 12px' }}>
              <button
                onClick={() => setHiddenOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: COLORS.warmGrey, fontWeight: 600, padding: '6px 0',
                }}
              >
                {hiddenCategories.length} hidden {hiddenCategories.length === 1 ? 'category' : 'categories'} {hiddenOpen ? '▾' : '▸'}
              </button>
              {hiddenOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
                  {hiddenCategories.map(cat => (
                    <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                      <span style={{ fontSize: 15, flexShrink: 0 }}>{cat.icon}</span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: COLORS.warmGrey }}>{cat.label}</span>
                      <button
                        onClick={() => toggleCategoryHidden(cat.id)}
                        style={{
                          background: COLORS.tealTint, color: COLORS.teal, border: 'none',
                          borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        Show
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {deletingCat && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
          }}
          onClick={e => { if (e.target === e.currentTarget) setDeletingCat(null) }}
        >
          <div style={{
            background: 'white', borderRadius: 16, padding: 20, width: '100%', maxWidth: 280,
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)', textAlign: 'center',
          }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal, marginBottom: 8, lineHeight: 1.4 }}>
              Delete "{deletingCat.label}"?
            </p>
            <p style={{ fontSize: 13, color: COLORS.warmGrey, marginBottom: 18, lineHeight: 1.4 }}>
              Saved items keep their other tags — they just won't show up here anymore.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDeletingCat(null)}
                style={{
                  flex: 1, minHeight: 40, borderRadius: 10, border: 'none',
                  background: COLORS.borderLight, color: COLORS.warmGrey,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  flex: 1, minHeight: 40, borderRadius: 10, border: 'none',
                  background: COLORS.danger, color: 'white',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
