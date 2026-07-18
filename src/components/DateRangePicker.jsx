import { useState } from 'react'
import { COLORS } from '../styles'

export const fmtDate = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''

export function DateRangePicker({ startDate, endDate, onChange, onDone }) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const [viewYear, setViewYear]   = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const monthName = new Date(viewYear, viewMonth, 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' })

  const firstDOW = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMo = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDOW; i++) cells.push(null)
  for (let d = 1; d <= daysInMo; d++) cells.push(d)

  const toDate  = (d) => new Date(viewYear, viewMonth, d)
  const isPast  = (d) => d && toDate(d) < today
  const isStart = (d) => d && startDate && toDate(d).toDateString() === startDate.toDateString()
  const isEnd   = (d) => d && endDate   && toDate(d).toDateString() === endDate.toDateString()
  const inRange = (d) => d && startDate && endDate && toDate(d) > startDate && toDate(d) < endDate

  const handleDay = (d) => {
    if (!d || isPast(d)) return
    const clicked = toDate(d)
    if (!startDate || (startDate && endDate)) {
      onChange({ start: clicked, end: null })
    } else if (clicked < startDate) {
      onChange({ start: clicked, end: startDate })
    } else if (clicked.toDateString() === startDate.toDateString()) {
      onChange({ start: null, end: null })
    } else {
      onChange({ start: startDate, end: clicked })
    }
  }

  // Trip dates only make sense in the future, so browsing before the
  // current month is disabled outright rather than just greying out days.
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth()

  const prevMonth = () => {
    if (isCurrentMonth) return
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const navBtn = (label, handler, disabled = false) => (
    <button
      onClick={handler}
      disabled={disabled}
      style={{
        width: 32, height: 32, borderRadius: '50%', border: 'none',
        background: disabled ? 'transparent' : COLORS.sand,
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 16, color: disabled ? '#D6CCBF' : COLORS.charcoal,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >{label}</button>
  )

  return (
    <div style={{
      background: 'white', border: `1.5px solid ${COLORS.border}`,
      borderRadius: 16, padding: '16px', marginTop: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        {navBtn('‹', prevMonth, isCurrentMonth)}
        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.charcoal }}>{monthName}</span>
        {navBtn('›', nextMonth)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 10 }}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <span key={d} style={{ fontSize: 11, fontWeight: 600, color: COLORS.warmGrey }}>{d}</span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((d, i) => {
          const sel = isStart(d) || isEnd(d)
          const rng = inRange(d)
          const pas = isPast(d)
          return (
            <div key={i} onClick={() => handleDay(d)} style={{
              height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: sel ? '50%' : rng ? 4 : '50%',
              background: sel ? COLORS.teal : rng ? COLORS.sand : 'transparent',
              color: sel ? 'white' : pas ? '#C8BEB0' : d ? COLORS.charcoal : 'transparent',
              fontSize: 13, fontWeight: sel ? 700 : 400,
              cursor: d && !pas ? 'pointer' : 'default',
            }}>
              {d}
            </div>
          )
        })}
      </div>

      {startDate && (
        <button
          onClick={onDone}
          style={{
            marginTop: 14, width: '100%', height: 42, borderRadius: 10,
            background: COLORS.teal, color: 'white', border: 'none',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}
        >
          {endDate ? 'Confirm dates' : 'Confirm start date'}
        </button>
      )}
    </div>
  )
}
