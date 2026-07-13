import { useState } from 'react'
import { accommodationCards, members, groupSpaceCategories } from '../data'
import { MemberDot } from '../components/MemberDot'
import { ItemImage } from '../components/ItemImage'
import { BackButton } from '../components/BackButton'

export function CategoryDetailScreen({ navigate, params = {} }) {
  const [cards, setCards] = useState(accommodationCards)

  const cat = groupSpaceCategories.find(c => c.id === params.categoryId)
    || groupSpaceCategories.find(c => c.id === 'accommodation')

  const backTo = params.backTo || 'groupSpace'
  const isAccommodation = params.categoryId === 'accommodation' || !params.categoryId

  const toggleHeart = (id) => {
    setCards(prev => prev.map(c =>
      c.id === id
        ? { ...c, hearted: !c.hearted, hearts: c.hearted ? c.hearts - 1 : c.hearts + 1 }
        : c
    ))
  }

  const contributorIds = [...new Set(cards.map(c => c.savedBy))]
  const notContributed = members.filter(m => !contributorIds.includes(m.id))

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '16px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <BackButton onClick={() => navigate(backTo)} />
          <div>
            <p style={{ fontWeight: 800, fontSize: 19, color: '#1C1410', letterSpacing: -0.5 }}>
              {cat.icon} {cat.label}
            </p>
            <p style={{ fontSize: 12, color: '#B5A898', marginTop: 1 }}>Group Space · {cards.length} items</p>
          </div>
        </div>

        {/* Contribution bar */}
        <div className="card" style={{ padding: '12px 14px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#B5A898', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>
            Contributors
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {contributorIds.map(id => {
              const m = members.find(m => m.id === id)
              return (
                <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <MemberDot memberId={id} size={30} />
                  <span style={{ fontSize: 9, fontWeight: 600, color: '#8A7A6A' }}>{m?.name}</span>
                </div>
              )
            })}
            {notContributed.length > 0 && (
              <>
                <div style={{ width: 1, height: 34, background: '#EDE7E0' }} />
                {notContributed.map(m => (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <MemberDot memberId={m.id} size={30} grey />
                    <span style={{ fontSize: 9, fontWeight: 600, color: '#C8BEB4' }}>{m.name}</span>
                  </div>
                ))}
              </>
            )}
          </div>
          {notContributed.length > 0 && (
            <p style={{ fontSize: 11, color: '#C8BEB4', marginTop: 8 }}>
              {notContributed.map(m => m.name).join(' & ')} {notContributed.length === 1 ? 'hasn\'t' : 'haven\'t'} added anything yet
            </p>
          )}
        </div>


        {/* Accountability box — accommodation only */}
        {isAccommodation && (
          <div style={{
            marginTop: 12,
            background: 'linear-gradient(140deg, #FEF8F0, #FEF2E8)',
            border: '1.5px solid #F5C4A0',
            borderRadius: 14, padding: '14px 16px',
          }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#1C1410', letterSpacing: -0.2, marginBottom: 10 }}>
              🎯 Everyone needs to find one option
            </p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              {members.map(m => {
                const hasSara = m.name === 'Sara'
                return (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: hasSara ? '#DDD6CE' : m.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: hasSara ? 14 : 12, fontWeight: 700,
                      color: 'white', position: 'relative',
                      boxShadow: hasSara ? 'none' : `0 2px 8px ${m.color}55`,
                    }}>
                      {hasSara ? '⏳' : '✓'}
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: 600,
                      color: hasSara ? '#B5A898' : '#5a4a3a',
                    }}>
                      {m.name}
                    </span>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12 }}>📅</span>
              <p style={{ fontSize: 12, color: '#8A7A6A', fontWeight: 600 }}>
                Decision needed by Thursday
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="screen-scroll" style={{ padding: '4px 20px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cards.map(card => {
            const saver = members.find(m => m.id === card.savedBy)
            return (
              <div key={card.id} className="card">
                <div style={{ position: 'relative' }}>
                  <ItemImage type={card.image} height={130} />
                  <span style={{
                    position: 'absolute', top: 10, right: 10,
                    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
                    color: 'white', fontSize: 10, fontWeight: 700,
                    borderRadius: 7, padding: '3px 8px',
                  }}>
                    {card.source}
                  </span>
                </div>

                <div style={{ padding: '13px 14px 14px' }}>
                  {/* Attribution */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: saver?.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 8, fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>
                      {saver?.initial}
                    </div>
                    <span style={{ fontSize: 12, color: '#8A7A6A' }}>
                      <strong style={{ color: '#5a4a3a', fontWeight: 700 }}>{saver?.name}</strong>
                      {' '}· {card.when}
                    </span>
                  </div>

                  <p style={{ fontWeight: 700, fontSize: 15, color: '#1C1410', lineHeight: 1.3, letterSpacing: -0.2, marginBottom: 5 }}>
                    {card.title}
                  </p>
                  <p style={{ fontSize: 12, color: '#8A7A6A', lineHeight: 1.45, marginBottom: 12 }}>
                    {card.note}
                  </p>

                  {/* Heart reaction */}
                  <button
                    onClick={() => toggleHeart(card.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: card.hearted ? '#FEF4F1' : '#F7F3EF',
                      border: `1.5px solid ${card.hearted ? '#E8705A' : '#EDE7E0'}`,
                      borderRadius: 20, padding: '6px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{card.hearted ? '❤️' : '🤍'}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: card.hearted ? '#E8705A' : '#B5A898' }}>
                      {card.hearts}
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => navigate('saveMoment', { destination: 'group' })}
          style={{
            marginTop: 14, width: '100%', height: 40,
            background: 'transparent', border: '1.5px dashed #D4C8BE',
            borderRadius: 12, cursor: 'pointer', fontSize: 13,
            fontWeight: 600, color: '#B5A898',
          }}
        >
          + Add an option
        </button>
      </div>
    </div>
  )
}
