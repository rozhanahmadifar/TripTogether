import { useState } from 'react'
import { TEXT, COLORS, SPACING, SHADOW_CARD } from '../styles'
import { MY_IDEAS_PHOTO } from '../data'
import { BackButton } from '../components/BackButton'
import { ActionMenu, PencilIcon, TrashIcon, EyeOffIcon } from '../components/ActionMenu'
import { CategoryIcon, CategoryIconBadge } from '../components/CategoryIcons'

// Full "My Ideas" list, reached from inside a trip. This is not a separate,
// trip-scoped stash — it's the exact same flat `myIdeas` list shown on the
// home page, just reachable from here too so you don't have to leave the
// trip to see it. Categories are the only organizing mechanism; if someone
// wants to keep a trip's ideas visually separate they can rename or add a
// category for it themselves (e.g. "Inspiration – Ireland").
export function MyIdeasScreen({ navigate, params = {}, userName, myIdeas, allCategories, addCustomCategory, renameCategory, deleteCategory, toggleCategoryHidden }) {
  const initial = userName ? userName.charAt(0).toUpperCase() : '?'
  const { backTo = 'groupHome' } = params
  const [addingSection, setAddingSection] = useState(false)
  const [sectionName, setSectionName]     = useState('')
  const [menuCat, setMenuCat]             = useState(null)
  const [renamingId, setRenamingId]       = useState(null)
  const [renameValue, setRenameValue]     = useState('')
  const [deletingCat, setDeletingCat]     = useState(null)
  const [hiddenOpen, setHiddenOpen]       = useState(false)
  const visibleCategories = allCategories.filter(c => !c.hidden)
  const hiddenCategories = allCategories.filter(c => c.hidden)

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
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <BackButton onClick={() => navigate(backTo)} />
            <div>
              <h1 style={TEXT.screenTitle}>
                My Ideas
              </h1>
              <p style={{ ...TEXT.subtext, marginTop: 4 }}>
                Only you can see these
              </p>
            </div>
          </div>
          {/* Same avatar recipe as Home's header — terracotta circle,
              user's initial — so this screen doesn't feel like a
              different app once you've navigated one level in. */}
          <div style={{
            width: 44, height: 44, borderRadius: '50%', background: COLORS.terracotta,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1,
            boxShadow: `0 2px 10px ${COLORS.terracotta}4D`, flexShrink: 0,
          }}>
            {initial}
          </div>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: `16px ${SPACING.screenX}px ${SPACING.scrollBottomPad}px` }}>
        {/* Static hero — same photo/overlay recipe as Home's My Ideas
            card, but not a button here: this screen already IS that
            destination, so there's no chevron or onClick, just the
            same warm, private-journal framing carried over. */}
        <div style={{
          position: 'relative',
          backgroundImage: [
            `linear-gradient(90deg, rgba(253,247,238,0.97) 0%, rgba(253,247,238,0.95) 48%, rgba(253,247,238,0.55) 65%, rgba(253,247,238,0.15) 100%)`,
            `url("${MY_IDEAS_PHOTO}")`,
          ].join(', '),
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center 38%',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundColor: COLORS.bgMyIdeas,
          border: `1px solid ${COLORS.borderLight}`,
          borderRadius: 20, padding: '22px 20px',
          marginBottom: SPACING.cardGap,
          boxShadow: '0 4px 16px rgba(26,18,12,0.08)',
        }}>
          <h3 style={{ ...TEXT.cardTitle, fontSize: 17, color: COLORS.charcoal, marginBottom: 6 }}>
            Your private inspiration space
          </h3>
          <p style={{ ...TEXT.subtext, color: COLORS.warmGrey, maxWidth: 220 }}>
            Save places, videos, notes and ideas for your next adventures.
          </p>
        </div>

        <div style={{
          background: COLORS.cardBg, borderRadius: 16, overflow: 'hidden',
          boxShadow: SHADOW_CARD,
        }}>
          {visibleCategories.map((cat) => {
            const items = myIdeas.filter(item => item.categoryIds.includes(cat.id))
            const isRenaming = renamingId === cat.id
            return (
              <div key={cat.id} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginLeft: 16 }}>
                    <CategoryIconBadge id={cat.id} tint={cat.color} shade={cat.shade} />
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
                      onClick={() => navigate('myIdeasCategory', { categoryId: cat.id, backTo: 'myIdeasFull', parentBackTo: backTo })}
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
                      <span style={{ fontSize: 16, color: COLORS.subtleIcon, flexShrink: 0 }}>›</span>
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
                        padding: '16px', fontSize: 15, color: COLORS.subtleIcon, flexShrink: 0,
                      }}
                    >
                      ⋯
                    </button>
                  )}
                </div>
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
                      <CategoryIcon id={cat.id} size={15} color={cat.shade || COLORS.warmGrey} />
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

        {/* Add a section — its own dashed-border box below the category
            list, same treatment as MyTripsScreen's "+ Start a New Trip"
            button, instead of a plain inline text link inside the list
            card. */}
        <div style={{ marginTop: 12 }}>
          {!addingSection ? (
            <button
              onClick={() => setAddingSection(true)}
              style={{
                width: '100%', height: 48, background: 'white',
                border: `1.5px dashed ${COLORS.border}`, borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: 'pointer', fontSize: 14, color: COLORS.teal, fontWeight: 600,
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
              Add a section
            </button>
          ) : (
            <div style={{
              display: 'flex', gap: 8, background: 'white', borderRadius: 14,
              border: `1px solid ${COLORS.borderLight}`, padding: 10,
            }}>
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
                  color: sectionName.trim() ? 'white' : COLORS.warmGrey,
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
