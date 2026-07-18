import { useState, useRef } from 'react'
import { MEMBER_COLORS, truncateName } from '../data'
import { DateRangePicker, fmtDate } from '../components/DateRangePicker'
import { BackButton } from '../components/BackButton'
import { COLORS, SPACING } from '../styles'

function XIcon({ size = 12, color = COLORS.warmGrey }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round">
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  )
}

function ProgressBar({ step }) {
  return (
    <div style={{ paddingBottom: 24 }}>
      <p style={{ fontSize: 12, color: COLORS.warmGrey, fontWeight: 600, marginBottom: 10 }}>Step {step} of 2</p>
      <div style={{ height: 4, background: COLORS.border, borderRadius: 4, position: 'relative' }}>
        <div style={{
          height: '100%', background: COLORS.teal, borderRadius: 4,
          width: step === 1 ? '50%' : '100%',
          transition: 'width 0.3s ease',
        }} />
        <span style={{
          position: 'absolute', top: -9, fontSize: 18,
          left: step === 1 ? 'calc(50% - 9px)' : 'calc(100% - 18px)',
          transition: 'left 0.3s ease',
        }}>✈️</span>
      </div>
    </div>
  )
}

export function CreateGroupTripScreen({ navigate, params = {}, startGroupTrip, userName }) {
  const [step, setStep]             = useState(1)
  const [tripName, setTripName]     = useState('')
  const [destination, setDestination] = useState('')
  const [dateRange, setDateRange]   = useState({ start: null, end: null })
  const [showCalendar, setShowCalendar] = useState(false)
  const [members, setMembers]       = useState([])
  const [nameInput, setNameInput]   = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [confirmingRemoveId, setConfirmingRemoveId] = useState(null)
  const nextMemberId = useRef(0)

  const dateLabel = dateRange.start
    ? dateRange.end
      ? `${fmtDate(dateRange.start)} – ${fmtDate(dateRange.end)}`
      : fmtDate(dateRange.start)
    : null

  const addMember = () => {
    const n = nameInput.trim()
    if (!n) return
    const email = emailInput.trim()
    const color = MEMBER_COLORS[members.length % MEMBER_COLORS.length]
    // A counter (not just Date.now()) guarantees unique ids even when two
    // members are added in the same millisecond — colliding ids meant
    // removing one member could silently remove both.
    const id = `m-${Date.now()}-${nextMemberId.current++}`
    setMembers(p => [...p, { id, name: n, email, color, initial: n.charAt(0).toUpperCase() }])
    setNameInput('')
    setEmailInput('')
  }

  const requestRemoveMember = (id) => setConfirmingRemoveId(id)
  const cancelRemoveMember = () => setConfirmingRemoveId(null)
  const confirmRemoveMember = (id) => {
    setMembers(p => p.filter(m => m.id !== id))
    setConfirmingRemoveId(null)
  }

  const handleStart = () => {
    startGroupTrip({
      name: tripName.trim() || 'My Trip',
      destination: destination.trim(),
      dates: dateLabel || '',
      startDate: dateRange.start ? dateRange.start.toISOString() : '',
      crewMembers: members,
      returnTo: params.returnTo,
      returnParams: params.returnParams,
    })
  }

  const inputStyle = () => ({
    width: '100%', border: 'none', background: 'none',
    padding: '0 14px', fontSize: 15, color: COLORS.charcoal, fontFamily: 'inherit',
    height: '100%',
  })

  const fieldWrap = (filled) => ({
    background: 'white', borderRadius: 14,
    border: `2px solid ${filled ? COLORS.teal : COLORS.border}`,
    height: 54, display: 'flex', alignItems: 'center',
    transition: 'border-color 0.15s ease',
    overflow: 'hidden',
  })

  return (
    <div className="screen" style={{ background: COLORS.bg }}>
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackButton onClick={() => step > 1 ? setStep(s => s - 1) : navigate(params.backTo || 'individualHome', params.backParams || {})} />
        <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.charcoal, letterSpacing: -0.4 }}>
          {step === 1 ? 'Name your trip' : 'Who is coming?'}
        </h2>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        <ProgressBar step={step} />
      </div>

      <div className="screen-scroll" style={{ padding: '4px 20px 40px' }}>
        {step === 1 && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 8 }}>
              {/* Trip name */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.3, marginBottom: 6 }}>
                  Trip name
                </p>
                <div style={fieldWrap(tripName)}>
                  <input
                    value={tripName}
                    onChange={e => setTripName(e.target.value)}
                    placeholder="e.g. Ireland with the gang"
                    style={inputStyle()}
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.3 }}>Where are you thinking</p>
                  <span style={{ fontSize: 11, color: '#A79E93', fontWeight: 500 }}>Optional</span>
                </div>
                <div style={fieldWrap(destination)}>
                  <span style={{ paddingLeft: 14, fontSize: 16, flexShrink: 0 }}>📍</span>
                  <input
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="e.g. Dublin, Ireland"
                    style={{ ...inputStyle(), paddingLeft: 8 }}
                  />
                </div>
              </div>

              {/* Dates — calendar picker */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.3 }}>When are you going</p>
                  <span style={{ fontSize: 11, color: '#A79E93', fontWeight: 500 }}>Optional</span>
                </div>
                <button
                  onClick={() => setShowCalendar(c => !c)}
                  style={{
                    width: '100%', height: 54, borderRadius: 14,
                    border: `2px solid ${dateRange.start ? COLORS.teal : COLORS.border}`,
                    background: 'white', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '0 14px',
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{ fontSize: 18 }}>📅</span>
                  <span style={{ fontSize: 15, color: dateRange.start ? COLORS.charcoal : '#A79E93', fontWeight: dateRange.start ? 600 : 400 }}>
                    {dateLabel || 'Choose dates'}
                  </span>
                  {dateRange.start && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setDateRange({ start: null, end: null }); setShowCalendar(false) }}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', color: COLORS.warmGrey, fontSize: 18, cursor: 'pointer' }}
                    >
                      ×
                    </button>
                  )}
                </button>

                {showCalendar && (
                  <DateRangePicker
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                    onChange={(range) => setDateRange(range)}
                    onDone={() => setShowCalendar(false)}
                  />
                )}
              </div>
            </div>

            <p style={{ fontSize: 12, color: COLORS.warmGrey, lineHeight: 1.5, marginBottom: 28, fontStyle: 'italic', marginTop: 8 }}>
              Not sure yet? No problem, you can fill these in later.
            </p>

            <button
              onClick={() => setStep(2)}
              style={{
                width: '100%', height: 52, borderRadius: 14, border: 'none',
                background: COLORS.teal, color: 'white',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                letterSpacing: -0.2,
              }}
            >
              Add Your Crew
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Name field */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.3, marginBottom: 6 }}>
                Name
              </p>
              <div style={fieldWrap(nameInput)}>
                <input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMember()}
                  placeholder="Their name"
                  autoFocus
                  style={inputStyle()}
                />
              </div>
            </div>

            {/* Email field */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.warmGrey, letterSpacing: 0.3 }}>Email</p>
                <span style={{ fontSize: 11, color: '#A79E93', fontWeight: 500 }}>Recommended</span>
              </div>
              <div style={fieldWrap(emailInput)}>
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMember()}
                  placeholder="their@email.com"
                  style={inputStyle()}
                />
              </div>
            </div>

            <button
              onClick={addMember}
              disabled={!nameInput.trim()}
              style={{
                width: '100%', height: 52, borderRadius: 14, border: 'none',
                background: nameInput.trim() ? COLORS.teal : COLORS.border,
                color: nameInput.trim() ? 'white' : '#A79E93',
                fontSize: 15, fontWeight: 600,
                cursor: nameInput.trim() ? 'pointer' : 'default',
                marginBottom: 20,
              }}
            >
              Add
            </button>

            {/* Everyone on the trip — creator first (non-removable), then
                anyone added — as one consistent list, not split across
                different parts of the screen. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  background: 'white', borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', background: '#D4724A',
                    border: '2px solid white', boxShadow: `0 0 0 1px ${COLORS.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0,
                  }}>
                    {(userName || '?').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal, letterSpacing: -0.2 }} title={userName}>{truncateName(userName)}</p>
                    <p style={{ fontSize: 12, color: COLORS.teal, fontWeight: 600, marginTop: 2 }}>You · Already joined</p>
                  </div>
                </div>

                {members.map((m) => (
                  <div
                    key={m.id}
                    className="member-slide-in"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                      background: 'white', borderRadius: 12,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', background: m.color,
                      border: '2px solid white', boxShadow: `0 0 0 1px ${COLORS.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>
                      {m.initial}
                    </div>
                    {confirmingRemoveId === m.id ? (
                      <>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: COLORS.danger }}>
                          Remove {truncateName(m.name)}?
                        </span>
                        <button
                          onClick={cancelRemoveMember}
                          style={{
                            minHeight: 32, borderRadius: 8, border: `1.5px solid ${COLORS.border}`,
                            background: 'white', color: COLORS.warmGrey, fontSize: 12, fontWeight: 700,
                            cursor: 'pointer', padding: '0 12px', flexShrink: 0, fontFamily: 'inherit',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => confirmRemoveMember(m.id)}
                          style={{
                            minHeight: 32, borderRadius: 8, border: 'none',
                            background: COLORS.danger, color: 'white', fontSize: 12, fontWeight: 700,
                            cursor: 'pointer', padding: '0 12px', flexShrink: 0, fontFamily: 'inherit',
                          }}
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal, letterSpacing: -0.2 }} title={m.name}>{truncateName(m.name)}</p>
                          {m.email ? (
                            <p style={{
                              fontSize: 12, color: COLORS.warmGrey, fontWeight: 500, marginTop: 2,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {m.email}
                            </p>
                          ) : (
                            <p style={{ fontSize: 12, color: COLORS.warmGrey, fontWeight: 500, fontStyle: 'italic', marginTop: 2 }}>
                              No email added
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => requestRemoveMember(m.id)}
                          style={{
                            width: 28, height: 28, borderRadius: '50%', border: 'none',
                            background: '#EFE8DE', cursor: 'pointer', padding: 0,
                            flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <XIcon size={12} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
            </div>

            <p style={{ fontSize: 12, color: COLORS.warmGrey, lineHeight: 1.5, marginBottom: 20, fontWeight: 500 }}>
              Members with an email address will receive an invite link to join your trip. Members without one can be added manually later.
            </p>

            <p style={{ fontSize: 12, color: COLORS.warmGrey, lineHeight: 1.5, marginBottom: 28, fontWeight: 500 }}>
              You can add more people later.
            </p>

            <button
              onClick={handleStart}
              style={{
                width: '100%', height: 52, borderRadius: 14, border: 'none',
                background: COLORS.teal,
                color: 'white',
                fontSize: 15, fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: -0.2,
              }}
            >
              Start Planning
            </button>
          </>
        )}
      </div>
    </div>
  )
}
