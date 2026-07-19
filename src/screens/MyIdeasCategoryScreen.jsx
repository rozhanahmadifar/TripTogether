import { useState } from 'react'
import { ItemCard } from '../components/ItemCard'
import { GridTile } from '../components/GridTile'
import { ViewToggle } from '../components/ViewToggle'
import { EmptyState } from '../components/EmptyState'
import { BackButton } from '../components/BackButton'
import { CategoryCover } from '../components/CategoryCover'
import { COLORS, SPACING } from '../styles'

export function MyIdeasCategoryScreen({ navigate, params = {}, myIdeas, allCategories, userName, deleteMyIdea, updateMyIdea }) {
  const { categoryId, backTo = 'individualHome' } = params
  const cat = allCategories.find(c => c.id === categoryId) || allCategories[0] || { id: '', icon: '✨', label: 'Ideas', color: '#1E5F5F' }
  const items = myIdeas.filter(i => i.categoryIds.includes(cat.id))
  const me = { name: userName || 'You', color: COLORS.teal, initial: (userName || 'You').charAt(0).toUpperCase() }
  const [view, setView] = useState('list')

  return (
    <div className="screen" style={{ background: COLORS.bgMyIdeas }}>
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
        <BackButton onClick={() => navigate(backTo)} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 19, fontWeight: 800, color: COLORS.teal, letterSpacing: -0.4 }}>
            {cat.icon} {cat.label}
          </p>
          <p style={{ fontSize: 12, color: COLORS.warmGrey, fontStyle: 'italic', marginTop: 2 }}>
            Private, only you can see these
          </p>
        </div>
        {items.length > 0 && <ViewToggle view={view} setView={setView} />}
      </div>

      <div className="screen-scroll" style={{ padding: `16px ${SPACING.screenX}px 32px` }}>
        <CategoryCover category={cat} items={items} />

        {items.length === 0 ? (
          <EmptyState
            categoryId={cat.id}
            heading={`Your ${cat.label} board is empty for now.`}
            actionLabel="Save something"
            onAction={() => navigate('saveSomething', { categoryId: cat.id, backTo: 'myIdeasCategory', returnParams: { categoryId: cat.id, backTo } })}
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
                contributor={me}
                source={item.platform}
                note={item.note}
                previewHeight={100}
                allCategories={allCategories}
                hideFooter
                onOpen={() => navigate('itemDetail', { itemId: item.id, categoryId: cat.id, backTo: 'myIdeasCategory', parentBackTo: backTo })}
                onDelete={() => deleteMyIdea(item.id)}
                onSave={(updates) => updateMyIdea(item.id, updates)}
              />
            ))}
          </div>
        )}

        {items.length > 0 && (
          <button
            onClick={() => navigate('saveSomething', { categoryId: cat.id, backTo: 'myIdeasCategory', returnParams: { categoryId: cat.id, backTo } })}
            style={{
              marginTop: SPACING.cardGap, width: '100%', minHeight: SPACING.inputMinHeight,
              background: 'transparent', border: '1.5px dashed #D6CCBF',
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
