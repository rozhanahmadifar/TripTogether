import { useState } from 'react'
import { CATEGORIES, MEMBER_COLORS } from './data'
import { HouseIcon, SuitcaseIcon, ChatIcon, SparkleIcon } from './components/TabIcons'
import { PlusIcon } from './components/ActionMenu'

import { WelcomeScreen }         from './screens/WelcomeScreen'
import { YourNameScreen }        from './screens/YourNameScreen'
import { IndividualHomeScreen }  from './screens/IndividualHomeScreen'
import { MyIdeasCategoryScreen } from './screens/MyIdeasCategoryScreen'
import { SaveSomethingScreen }   from './screens/SaveSomethingScreen'
import { ItemDetailScreen }      from './screens/ItemDetailScreen'
import { ShareSuccessScreen }    from './screens/ShareSuccessScreen'
import { CreateGroupTripScreen } from './screens/CreateGroupTripScreen'
import { GroupHomeScreen }       from './screens/GroupHomeScreen'
import { GroupSpaceScreen }      from './screens/GroupSpaceScreen'
import { MySavesScreen }         from './screens/MySavesScreen'
import { GroupCategoryScreen }   from './screens/GroupCategoryScreen'
import { AIScreen }              from './screens/AIScreen'
import { MyTripsScreen }         from './screens/MyTripsScreen'
import { DiscussScreen }         from './screens/DiscussScreen'
import { DiscussThreadScreen }   from './screens/DiscussThreadScreen'

const SCREEN_MAP = {
  welcome:         WelcomeScreen,
  yourName:        YourNameScreen,
  individualHome:  IndividualHomeScreen,
  myIdeasCategory: MyIdeasCategoryScreen,
  saveSomething:   SaveSomethingScreen,
  itemDetail:      ItemDetailScreen,
  shareSuccess:    ShareSuccessScreen,
  createTrip:      CreateGroupTripScreen,
  groupHome:       GroupHomeScreen,
  groupSpace:      GroupSpaceScreen,
  mySaves:         MySavesScreen,
  groupCategory:   GroupCategoryScreen,
  ai:              AIScreen,
  myTrips:         MyTripsScreen,
  discuss:         DiscussScreen,
  discussThread:   DiscussThreadScreen,
}

const MAIN_NAV = [
  { id: 'home',    Icon: HouseIcon,    label: 'Home',    screen: 'individualHome' },
  { id: 'trips',   Icon: SuitcaseIcon, label: 'Trips',    screen: 'myTrips' },
  { id: 'discuss', Icon: ChatIcon,     label: 'Discuss',  screen: 'discuss' },
  { id: 'ai',      Icon: SparkleIcon,  label: 'AI',       screen: 'ai' },
]

// Screens that show the bottom tab bar
const NAV_SCREENS = new Set(['individualHome', 'myTrips', 'ai', 'groupHome', 'groupSpace', 'mySaves', 'discuss'])

// Screens that show the floating + button (ai excluded; groupCategory added).
// It's the only add action on each of these screens — no duplicate "+ Add"
// text links alongside it.
const PLUS_BTN_SCREENS = new Set(['individualHome', 'myTrips', 'groupHome', 'groupSpace', 'groupCategory', 'mySaves'])

const getActiveTab = (s) => {
  if (s === 'ai') return 'ai'
  if (s === 'discuss' || s === 'discussThread') return 'discuss'
  if (s === 'myTrips' || s === 'groupHome' || s === 'groupSpace' || s === 'mySaves') return 'trips'
  return 'home'
}

const getPlusBtnCtx = (s, p) => {
  if (s === 'groupSpace' || s === 'groupCategory' || s === 'groupHome') {
    return { label: 'Add to group', navParams: { mode: 'group', categoryId: p?.categoryId || '', backTo: s } }
  }
  return { label: 'Save idea', navParams: { mode: 'personal', backTo: s } }
}

const CUSTOM_COLORS = ['#D4724A', '#1E5F5F', '#E8B84A', '#5B8DBE', '#6BAE8A', '#9B8AC4']

export default function App() {
  const [screen, setScreen]                     = useState('welcome')
  const [params, setParams]                     = useState({})
  const [userName, setUserName]                 = useState('')
  const [appMode, setAppMode]                   = useState('individual')
  const [myIdeas, setMyIdeas]                   = useState([])
  const [groupItems, setGroupItems]             = useState([])
  const [trips, setTrips]                       = useState([])
  const [currentTripId, setCurrentTripId]       = useState(null)
  const [categories, setCategories]             = useState(CATEGORIES)
  const [modal, setModal]                       = useState(null)
  const [discussMessages, setDiscussMessages]   = useState({})
  const [customThreads, setCustomThreads]       = useState({})

  const navigate = (id, newParams = {}) => {
    setScreen(id)
    setParams(newParams)
  }

  const openModal  = (content) => setModal(content)
  const closeModal = () => setModal(null)

  const allCategories = categories

  const addCustomCategory = (label) => {
    const id = `custom-${Date.now()}`
    const color = CUSTOM_COLORS[categories.length % CUSTOM_COLORS.length]
    setCategories(p => [...p, { id, icon: '📌', label, color }])
    return id
  }

  const renameCategory = (id, label) => {
    setCategories(p => p.map(c => c.id === id ? { ...c, label } : c))
  }

  // Deleting a category untags it from every item rather than deleting the
  // items themselves — losing a tag is recoverable, losing saved content isn't.
  const deleteCategory = (id) => {
    setCategories(p => p.filter(c => c.id !== id))
    setMyIdeas(p => p.map(i => ({ ...i, categoryIds: i.categoryIds.filter(cid => cid !== id) })))
    setGroupItems(p => p.map(i => ({ ...i, categoryIds: i.categoryIds.filter(cid => cid !== id) })))
  }

  // Hiding is the lightweight, reversible alternative to deleting — it just
  // collapses a category out of the list, nothing about tagged items changes.
  const toggleCategoryHidden = (id) => {
    setCategories(p => p.map(c => c.id === id ? { ...c, hidden: !c.hidden } : c))
  }

  // Items are stored flat with a `categoryIds` array so a single item can be
  // tagged into more than one category view (see MyIdeasCategoryScreen /
  // GroupCategoryScreen, which filter by `categoryIds.includes(cat.id)`).
  const saveToMyIdeas = ({ title, note, link, platform, categoryIds, hasPhoto, photo }) => {
    const item = { id: `i-${Date.now()}`, title, note, link, platform, categoryIds, hasPhoto: !!hasPhoto, photo: photo || '', savedAt: Date.now() }
    setMyIdeas(p => [...p, item])
    return item
  }

  const addToGroup = ({ title, note, link, platform, categoryIds, hasPhoto, photo }) => {
    const item = {
      id: `g-${Date.now()}`, title, note, link, platform, categoryIds, hasPhoto: !!hasPhoto, photo: photo || '',
      savedBy: userName, savedAt: Date.now(), hearts: 0, hearted: false, starredBy: [],
    }
    setGroupItems(p => [...p, item])
    return item
  }

  const toggleHeart = (itemId) => {
    setGroupItems(p => p.map(i =>
      i.id === itemId
        ? { ...i, hearted: !i.hearted, hearts: i.hearted ? i.hearts - 1 : i.hearts + 1 }
        : i
    ))
  }

  // Any number of members can star an item — it's per-member attribution
  // (who starred it), not a single "decided" flag, so multiple things in a
  // category can all be starred at once.
  const toggleStar = (itemId) => {
    setGroupItems(p => p.map(i => {
      if (i.id !== itemId) return i
      const starredBy = i.starredBy || []
      const already = starredBy.includes(userName)
      return { ...i, starredBy: already ? starredBy.filter(n => n !== userName) : [...starredBy, userName] }
    }))
  }

  const deleteMyIdea = (itemId) => {
    setMyIdeas(p => p.filter(i => i.id !== itemId))
  }

  const deleteGroupItem = (itemId) => {
    setGroupItems(p => p.filter(i => i.id !== itemId))
  }

  const updateMyIdea = (itemId, updates) => {
    setMyIdeas(p => p.map(i => i.id === itemId ? { ...i, ...updates } : i))
  }

  const updateGroupItem = (itemId, updates) => {
    setGroupItems(p => p.map(i => i.id === itemId ? { ...i, ...updates } : i))
  }

  const startGroupTrip = ({ name, destination, dates, startDate, crewMembers, returnTo, returnParams }) => {
    // The creator is added as an already-joined member up front — they never
    // have to add themselves to their own trip.
    const me = { id: 'me', name: userName, color: '#D4724A', initial: userName.charAt(0).toUpperCase(), joined: true }
    const trip = { id: `t-${Date.now()}`, name, destination, dates, startDate: startDate || '', members: [me, ...crewMembers] }
    setTrips(p => [...p, trip])
    setCurrentTripId(trip.id)
    setAppMode('group')
    // Every trip gets its own named discussion thread instead of a generic
    // "General" one, pinned so it can't be deleted.
    addDiscussThread(trip.id, name || 'My Trip', { pinned: true, subtext: `This is ${name || 'your trip'}'s main discussion space.` })
    if (returnTo) {
      setScreen(returnTo)
      setParams(returnParams || {})
    } else {
      setScreen('groupHome')
      setParams({})
    }
  }

  const openTrip = (tripId) => {
    setCurrentTripId(tripId)
    setAppMode('group')
    setScreen('groupHome')
    setParams({})
  }

  const updateTrip = (tripId, updates) => {
    setTrips(p => p.map(t => t.id === tripId ? { ...t, ...updates } : t))
  }

  const addDiscussMessage = (tripId, threadId, message) => {
    const key = `${tripId}-${threadId}`
    setDiscussMessages(p => ({ ...p, [key]: [...(p[key] || []), message] }))
  }

  const addDiscussThread = (tripId, title, opts = {}) => {
    const id = `thread-${Date.now()}`
    const thread = { id, title, pinned: !!opts.pinned, subtext: opts.subtext || '' }
    setCustomThreads(p => ({ ...p, [tripId]: [...(p[tripId] || []), thread] }))
    return id
  }

  const deleteDiscussThread = (tripId, threadId) => {
    setCustomThreads(p => ({ ...p, [tripId]: (p[tripId] || []).filter(t => t.id !== threadId) }))
    setDiscussMessages(p => {
      const key = `${tripId}-${threadId}`
      if (!(key in p)) return p
      const rest = { ...p }
      delete rest[key]
      return rest
    })
  }

  const currentTrip = trips.find(t => t.id === currentTripId)
    || (trips.length > 0 ? trips[trips.length - 1] : null)
  const hasGroup = trips.length > 0

  const showNav  = NAV_SCREENS.has(screen)
  const showPlus = PLUS_BTN_SCREENS.has(screen)
  const activeTab = getActiveTab(screen)

  const sharedProps = {
    navigate, params, userName, setUserName,
    appMode, myIdeas, groupItems,
    trips, currentTrip, hasGroup,
    allCategories, addCustomCategory, renameCategory, deleteCategory, toggleCategoryHidden,
    saveToMyIdeas, addToGroup, toggleHeart, toggleStar,
    deleteMyIdea, deleteGroupItem, updateMyIdea, updateGroupItem,
    startGroupTrip, openTrip, updateTrip,
    openModal, closeModal,
    discussMessages, addDiscussMessage,
    customThreads, addDiscussThread, deleteDiscussThread,
  }

  const CurrentScreen = SCREEN_MAP[screen] || WelcomeScreen

  const plusCtx = showPlus ? getPlusBtnCtx(screen, params) : null

  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <CurrentScreen {...sharedProps} />

        {showNav && (
          <nav style={{
            height: 64, paddingTop: 8, background: '#FFFFFF', borderTop: '1px solid #E5DDD4',
            display: 'flex', flexShrink: 0, boxSizing: 'border-box',
          }}>
            {MAIN_NAV.map(item => {
              const active = activeTab === item.id
              const { Icon } = item
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.screen)}
                  style={{
                    flex: 1, border: 'none', background: 'none', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'flex-start', gap: 4,
                  }}
                >
                  <Icon active={active} size={22} />
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
                    color: active ? '#1E5F5F' : '#5A5048',
                  }}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>
        )}

        {showPlus && plusCtx && (
          <div style={{
            position: 'absolute',
            bottom: showNav ? 76 : 16,
            right: 16,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            zIndex: 10,
          }}>
            <button
              onClick={() => navigate('saveSomething', plusCtx.navParams)}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                background: '#1E5F5F', color: 'white', border: 'none',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(0,0,0,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <PlusIcon size={24} />
            </button>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#1E5F5F', letterSpacing: 0.2 }}>
              {plusCtx.label}
            </span>
          </div>
        )}

        {modal && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
            {modal}
          </div>
        )}
      </div>
    </div>
  )
}
