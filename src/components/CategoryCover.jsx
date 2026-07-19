import { isImagePhoto } from '../data'
import illustrationInspiration from '../assets/illustrations/inspiration.svg'
import illustrationDestination from '../assets/illustrations/destination.svg'
import illustrationAccommodation from '../assets/illustrations/accommodation.svg'
import illustrationActivities from '../assets/illustrations/activities.svg'
import illustrationTransport from '../assets/illustrations/transport.svg'
import illustrationFood from '../assets/illustrations/food.svg'

const ILLUSTRATIONS = {
  inspiration: illustrationInspiration,
  destination: illustrationDestination,
  accommodation: illustrationAccommodation,
  activities: illustrationActivities,
  transport: illustrationTransport,
  food: illustrationFood,
}

// The category's default header is a warm, hand-designed illustration
// (unDraw, recolored to that category's own accent) until a real photo
// exists — then the photo takes over as the cover, preferring the decided
// item's photo, falling back to the most recently saved one. Custom
// (user-added) sections have no illustration and simply show nothing here.
export function CategoryCover({ category, items }) {
  const withPhoto = items.filter(i => isImagePhoto(i.photo))
  const decided = withPhoto.find(i => (i.starredBy || []).length > 0)
  const cover = decided || [...withPhoto].sort((a, b) => b.savedAt - a.savedAt)[0]

  if (cover) {
    return (
      <div style={{ width: '100%', height: 160, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
        <img src={cover.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }

  const illustration = ILLUSTRATIONS[category.id]
  if (!illustration) return null

  return (
    <div style={{
      width: '100%', height: 160, borderRadius: 16, overflow: 'hidden', marginBottom: 16,
      background: `${category.color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, boxSizing: 'border-box',
    }}>
      <img src={illustration} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  )
}
