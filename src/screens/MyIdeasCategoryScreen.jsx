import { useState } from 'react'
import { ItemCard } from '../components/ItemCard'
import { GridTile } from '../components/GridTile'
import { ViewToggle } from '../components/ViewToggle'
import { EmptyState } from '../components/EmptyState'
import { BackButton } from '../components/BackButton'
import { CATEGORY_PHOTOS, MY_IDEAS_PHOTO } from '../data'
import { COLORS, SPACING } from '../styles'

export function MyIdeasCategoryScreen({ navigate, params = {}, myIdeas, trips, allCategories, deleteMyIdea, updateMyIdea }) {
  // `parentBackTo` is the *opener's own* backTo (e.g. My Ideas' own way
  // back to Home or Group Home) — it has to be handed back on our own
  // back button below, or it's lost the moment we navigate away and My
  // Ideas' back button falls through to its default instead of where the
  // user actually came from.
  const { categoryId, backTo = 'individualHome', parentBackTo } = params
  const cat = allCategories.find(c => c.id === categoryId) || allCategories[0] || { id: '', icon: '✨', label: 'Ideas', color: '#1E5F5F' }
  // One flat list, shown identically everywhere it's reached from — no
  // filtering by trip, whether opened from the home page or from inside a
  // trip.
  const items = myIdeas.filter(i => i.categoryIds.includes(cat.id))
  // An idea can be shared into more than one trip, so this joins every
  // shared trip's name into one readable string for the card's single badge.
  const sharedTripNameFor = (item) => {
    const names = (item.sharedTripIds || []).map(id => (trips || []).find(t => t.id === id)?.name).filter(Boolean)
    if (names.length === 0) return undefined
    if (names.length === 1) return names[0]
    return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
  }
  const [view, setView] = useState('list')
  // Inspiration's own CATEGORY_PHOTOS entry is a busy, colorful map/
  // notebook scene — already identified and replaced elsewhere in the app
  // (Home's My Ideas card) in favor of this warmer, calmer flat-lay. Every
  // other category keeps its existing, already-vetted photo.
  const headerPhoto = cat.id === 'inspiration' ? MY_IDEAS_PHOTO : (CATEGORY_PHOTOS[cat.id] || CATEGORY_PHOTOS.inspiration)

  return (
    <div className="screen" style={{ background: COLORS.bgMyIdeas }}>
      {/* Photo band — its own shorter section, not an overlay carrying
          text legibility. Back button and the List/Grid toggle float on
          top of it (both already opaque/light enough to read on a photo);
          the title and subtext live below it on the plain page
          background instead of stacked on the image. */}
      <div style={{
        position: 'relative', height: 140,
        backgroundImage: `url("${headerPhoto}")`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', backgroundColor: COLORS.teal,
      }}>
        <div style={{
          position: 'absolute', top: 16, left: 20, right: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <BackButton onClick={() => navigate(backTo, parentBackTo ? { backTo: parentBackTo } : {})} />
          {items.length > 0 && <ViewToggle view={view} setView={setView} />}
        </div>
      </div>
      <div style={{ padding: '16px 20px 4px', background: COLORS.bgMyIdeas }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.teal, letterSpacing: -0.4 }}>
          {cat.label}
        </h1>
        <p style={{ fontSize: 13, color: COLORS.warmGrey, marginTop: 2 }}>
          🔒 Private • Only you can see these
        </p>
      </div>

      <div className="screen-scroll" style={{ padding: `16px ${SPACING.screenX}px 32px` }}>
        {items.length === 0 ? (
          <EmptyState
            categoryId={cat.id}
            color={cat.color}
            shade={cat.shade}
            heading={`Your ${cat.label} board is empty for now.`}
            actionLabel="Save something"
            onAction={() => navigate('saveSomething', { categoryId: cat.id, mode: 'personal', backTo: 'myIdeasCategory', returnParams: { categoryId: cat.id, backTo } })}
          />
        ) : view === 'grid' ? (
          <div style={{ columnCount: 2, columnGap: 14 }}>
            {items.map(item => (
              <GridTile
                key={item.id}
                item={item}
                category={cat}
                onOpen={() => navigate('itemDetail', { itemId: item.id, categoryId: cat.id, backTo: 'myIdeasCategory', parentBackTo: backTo })}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.cardGap }}>
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                categories={item.categoryIds.map(id => allCategories.find(c => c.id === id)).filter(Boolean)}
                source={item.platform}
                note={item.note}
                allCategories={allCategories}
                hideFooter
                compact
                sharedWithTripName={sharedTripNameFor(item)}
                onOpen={() => navigate('itemDetail', { itemId: item.id, categoryId: cat.id, backTo: 'myIdeasCategory', parentBackTo: backTo })}
                onDelete={() => deleteMyIdea(item.id)}
                onSave={(updates) => updateMyIdea(item.id, updates)}
              />
            ))}
          </div>
        )}

        {items.length > 0 && (
          <button
            onClick={() => navigate('saveSomething', { categoryId: cat.id, mode: 'personal', backTo: 'myIdeasCategory', returnParams: { categoryId: cat.id, backTo } })}
            style={{
              marginTop: SPACING.cardGap, width: '100%', minHeight: SPACING.inputMinHeight,
              background: 'transparent', border: `1.5px dashed ${COLORS.subtleIcon}`,
              borderRadius: 12, cursor: 'pointer', fontSize: 14,
              fontWeight: 600, color: COLORS.warmGrey,
            }}
          >
            + Save something to {cat.label}
          </button>
        )}
      </div>
    </div>
  )
}
