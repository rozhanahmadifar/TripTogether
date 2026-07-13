import { ItemCard } from '../components/ItemCard'
import { EmptyState } from '../components/EmptyState'
import { BackButton } from '../components/BackButton'
import { COLORS, SPACING } from '../styles'

export function MyIdeasCategoryScreen({ navigate, params = {}, myIdeas, allCategories, userName, deleteMyIdea, updateMyIdea }) {
  const { categoryId, backTo = 'individualHome' } = params
  const cat = allCategories.find(c => c.id === categoryId) || allCategories[0] || { id: '', icon: '✨', label: 'Ideas', color: '#1E5F5F' }
  const items = myIdeas[cat.id] || []
  const me = { name: userName || 'You', color: COLORS.teal, initial: (userName || 'You').charAt(0).toUpperCase() }

  return (
    <div className="screen" style={{ background: COLORS.bgMyIdeas }}>
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
        <BackButton onClick={() => navigate(backTo)} />
        <div>
          <p style={{ fontSize: 19, fontWeight: 800, color: COLORS.teal, letterSpacing: -0.4 }}>
            {cat.icon} {cat.label}
          </p>
          <p style={{ fontSize: 12, color: COLORS.warmGrey, fontStyle: 'italic', marginTop: 2 }}>
            Private, only you can see these
          </p>
        </div>
      </div>

      <div className="screen-scroll" style={{ padding: `16px ${SPACING.screenX}px 32px` }}>
        {items.length === 0 ? (
          <EmptyState
            categoryId={cat.id}
            heading={`Your ${cat.label} board is empty for now.`}
            actionLabel="Save something"
            onAction={() => navigate('saveSomething', { categoryId: cat.id, backTo: 'myIdeasCategory', returnParams: { categoryId: cat.id, backTo } })}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.cardGap }}>
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                category={cat}
                contributor={me}
                source={item.platform}
                description={item.description}
                previewHeight={100}
                allCategories={allCategories}
                hideFooter
                onOpen={() => navigate('itemDetail', { itemId: item.id, categoryId: cat.id, backTo: 'myIdeasCategory', parentBackTo: backTo })}
                onDelete={() => deleteMyIdea(cat.id, item.id)}
                onSave={(updates) => updateMyIdea(cat.id, item.id, updates)}
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
