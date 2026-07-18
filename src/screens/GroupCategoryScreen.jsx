import { useState } from 'react'
import { ItemCard } from '../components/ItemCard'
import { GridTile } from '../components/GridTile'
import { ViewToggle } from '../components/ViewToggle'
import { EmptyState } from '../components/EmptyState'
import { BackButton } from '../components/BackButton'
import { CommentSheet, buildSimulatedComments } from '../components/CommentSheet'
import { COLORS, SPACING } from '../styles'

export function GroupCategoryScreen({ navigate, params = {}, currentTrip, groupItems, addToGroup, toggleHeart, toggleStar, deleteGroupItem, updateGroupItem, userName, allCategories, openModal, closeModal }) {
  const { categoryId } = params
  const cat = allCategories.find(c => c.id === categoryId) || allCategories[0] || { id: '', icon: '✨', label: 'Ideas', color: '#1E5F5F' }
  const items = groupItems.filter(i => i.categoryIds.includes(cat.id))
  const tripMembers = currentTrip?.members || []

  const contributorNames = [...new Set(items.map(i => i.savedBy))]

  const getMember = (name) => {
    const found = tripMembers.find(m => m.name === name)
    if (found) return found
    if (name === userName) return { name, color: COLORS.terracotta, initial: name.charAt(0).toUpperCase() }
    return { name, color: '#B5AA9C', initial: name.charAt(0).toUpperCase() }
  }

  const nonContributors = tripMembers.filter(m => !contributorNames.includes(m.name))

  const [commentsByItem, setCommentsByItem] = useState({})
  const [view, setView] = useState('list')

  const openComments = (item) => {
    const me = getMember(userName)
    const simulated = buildSimulatedComments(tripMembers, userName)
    openModal(
      <CommentSheet
        initialComments={commentsByItem[item.id] || simulated}
        meMember={me}
        onAdd={(c) => setCommentsByItem(prev => ({ ...prev, [item.id]: [...(prev[item.id] || simulated), c] }))}
        onClose={closeModal}
        item={item}
        starred={(item.starredBy || []).includes(userName)}
        onToggleStar={() => toggleStar(item.id)}
      />
    )
  }

  return (
    <div className="screen" style={{ background: COLORS.bgGroupSpace }}>
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
        <BackButton onClick={() => navigate(params.backTo || 'groupSpace')} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 19, fontWeight: 800, color: COLORS.teal, letterSpacing: -0.4 }}>
            {cat.icon} {cat.label}
          </p>
          <p style={{ fontSize: 12, color: COLORS.warmGrey, marginTop: 2 }}>Group Space</p>
        </div>
        {items.length > 0 && <ViewToggle view={view} setView={setView} />}
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
              {tripMembers.map(m => {
                const contributed = contributorNames.includes(m.name)
                return (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: contributed ? m.color : 'transparent',
                      border: contributed ? 'none' : '2px dashed #D6CCBF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: contributed ? 'white' : '#B5AA9C',
                      boxShadow: contributed ? `0 0 0 3px ${m.color}40` : 'none',
                    }}>
                      {m.initial}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: contributed ? COLORS.charcoal : COLORS.warmGrey }}>
                      {m.name}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
          {nonContributors.length > 0 && (
            <p style={{ fontSize: 12, color: COLORS.warmGrey, marginTop: 14, fontStyle: 'italic', fontWeight: 500 }}>
              Waiting for {nonContributors.map(m => m.name).join(' & ')} to add something
            </p>
          )}
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <EmptyState
            categoryId={cat.id}
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
                onOpen={() => openComments(item)}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.cardGap }}>
            {items.map(item => {
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
                  onCommentClick={() => openComments(item)}
                  isOwner={item.savedBy === userName}
                  onDelete={() => deleteGroupItem(item.id)}
                  onSave={(updates) => updateGroupItem(item.id, updates)}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
