import { useState } from 'react'
import { colorForName, CATEGORY_PHOTOS } from '../data'
import { ItemCard } from '../components/ItemCard'
import { GridTile } from '../components/GridTile'
import { ViewToggle } from '../components/ViewToggle'
import { EmptyState } from '../components/EmptyState'
import { BackButton } from '../components/BackButton'
import { CategoryIcon } from '../components/CategoryIcons'
import { COLORS, SPACING } from '../styles'

export function GroupCategoryScreen({ navigate, params = {}, currentTrip, groupItems, addToGroup, toggleHeart, toggleStar, deleteGroupItem, updateGroupItem, userName, allCategories, decidedTipDismissed, dismissDecidedTip }) {
  const { categoryId } = params
  const cat = allCategories.find(c => c.id === categoryId) || allCategories[0] || { id: '', icon: '✨', label: 'Ideas', color: '#1E5F5F' }
  const items = groupItems.filter(i => i.categoryIds.includes(cat.id))
  const tripMembers = currentTrip?.members || []

  const contributorNames = [...new Set(items.map(i => i.savedBy))]

  // Color always comes from the name itself (see colorForName) rather than
  // whatever's stored on the matching member object, so it's identical to
  // how this same person's avatar renders on every other screen.
  const getMember = (name) => ({ name, color: colorForName(name), initial: name.charAt(0).toUpperCase() })

  const nonContributors = tripMembers.filter(m => !contributorNames.includes(m.name))
  const contributingMembers = tripMembers.filter(m => contributorNames.includes(m.name))

  const [view, setView] = useState('list')

  return (
    <div className="screen" style={{ background: COLORS.bgGroupSpace }}>
      {/* A real photo banner instead of a plain white bar — six category
          screens used to be the same template with a different label; a
          photo per category (see CATEGORY_PHOTOS in data.js) gives each one
          its own identity at a glance. */}
      <div style={{
        position: 'relative', padding: '16px 20px 20px', minHeight: 108,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        backgroundImage: [
          'linear-gradient(175deg, rgba(10,28,28,0.25) 0%, rgba(8,22,22,0.68) 100%)',
          `url("${CATEGORY_PHOTOS[cat.id] || CATEGORY_PHOTOS.inspiration}")`,
        ].join(', '),
        backgroundSize: 'cover, cover', backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat', backgroundColor: COLORS.teal,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackButton onClick={() => navigate(params.backTo || 'groupSpace')} />
          {items.length > 0 && <ViewToggle view={view} setView={setView} />}
        </div>
        <div>
          <p style={{
            fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: -0.4,
            display: 'flex', alignItems: 'center', gap: 8,
            textShadow: '0 1px 8px rgba(0,0,0,0.4)',
          }}>
            <CategoryIcon id={cat.id} size={20} color="white" /> {cat.label}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2, textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>
            Group Space
          </p>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: `16px ${SPACING.screenX}px ${SPACING.scrollBottomPad}px` }}>
        {/* Contributors card — celebratory, not an audit */}
        <div style={{
          background: 'white', borderRadius: 14, padding: SPACING.cardPad, marginBottom: SPACING.sectionGap,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.teal, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>
            Who has contributed
          </p>
          {tripMembers.length === 0 ? (
            <p style={{ fontSize: 12, color: COLORS.warmGrey, fontStyle: 'italic', fontWeight: 500 }}>No group members yet.</p>
          ) : (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {/* Only members who've contributed are ever rendered here —
                  no dashed placeholder circle or name for anyone who
                  hasn't, so the interface never identifies who's behind. */}
              {contributingMembers.map(m => (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: m.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: 'white', lineHeight: 1,
                    boxShadow: `0 0 0 3px ${m.color}40`,
                  }}>
                    {m.initial}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.charcoal }}>
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          )}
          {/* Aggregate, not a named call-out — everyone sees the same
              neutral count regardless of who specifically hasn't added
              anything yet. */}
          {nonContributors.length > 0 && (
            <p style={{ fontSize: 12, color: COLORS.warmGrey, marginTop: 14, fontStyle: 'italic', fontWeight: 500 }}>
              {contributorNames.length} of {tripMembers.length} crew have added something
            </p>
          )}
          {/* A quiet, personal nudge only the non-contributor themselves
              sees — never shown to the rest of the group as their name. */}
          {!contributorNames.includes(userName) && tripMembers.some(m => m.name === userName) && (
            <button
              onClick={() => navigate('saveSomething', { categoryId: cat.id, mode: 'group', backTo: 'groupCategory', returnParams: { categoryId: cat.id } })}
              style={{
                marginTop: 10, background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 700, color: COLORS.teal, padding: 0,
              }}
            >
              + Add your first idea here
            </button>
          )}
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <EmptyState
            categoryId={cat.id}
            color={cat.color}
            shade={cat.shade}
            heading={`Nothing in ${cat.label} yet`}
            actionLabel="Add the first item"
            onAction={() => navigate('saveSomething', { categoryId: cat.id, mode: 'group', backTo: 'groupCategory', returnParams: { categoryId: cat.id } })}
          />
        ) : view === 'grid' ? (
          <div style={{ columnCount: 2, columnGap: 14 }}>
            {items.map(item => (
              <GridTile
                key={item.id}
                item={item}
                category={cat}
                onOpen={() => toggleStar(item.id)}
                decidable
              />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.cardGap }}>
            {items.map((item, i) => {
              const saver = getMember(item.savedBy)
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  categories={item.categoryIds.map(id => allCategories.find(c => c.id === id)).filter(Boolean)}
                  contributor={saver}
                  source={item.platform}
                  note={item.note}
                  hearts={item.hearts}
                  hearted={item.hearted}
                  starred={(item.starredBy || []).includes(userName)}
                  starredBy={item.starredBy || []}
                  onToggleStar={() => toggleStar(item.id)}
                  previewHeight={110}
                  allCategories={allCategories}
                  onToggleHeart={() => toggleHeart(item.id)}
                  isOwner={item.savedBy === userName}
                  onDelete={() => deleteGroupItem(item.id)}
                  onSave={(updates) => updateGroupItem(item.id, updates)}
                  decidedTip={i === 0 && !decidedTipDismissed}
                  onDismissDecidedTip={dismissDecidedTip}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
