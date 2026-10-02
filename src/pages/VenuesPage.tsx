import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useCity } from '../context/CityContext'
import { usePageTitle } from '../hooks/usePageTitle'

export function VenuesPage() {
  usePageTitle('Venues')
  const { venues, events } = useCity()

  return (
    <>
      <PageHeader
        eyebrow="VENUES"
        title="Where the city gathers"
        lede="Demo rooms and lawns in parts of Faisalabad you already know. Addresses are area-level until an organizer connects a door."
      />
      <div className="mx-auto max-w-[1240px] px-4 pb-16 md:px-6">
        <ul className="divide-y divide-line border-t border-line">
          {venues.map((venue) => {
            const count = events.filter((event) => event.venueId === venue.id).length
            return (
              <li key={venue.id}>
                <Link to={`/venues/${venue.slug}`} className="grid items-center gap-5 py-6 md:grid-cols-[220px_minmax(0,1fr)_auto]">
                  <img src={venue.image} alt="" className="aspect-[3/2] w-full rounded-2xl object-cover" />
                  <span>
                    <span className="block text-xl font-semibold tracking-tight">{venue.name}</span>
                    <span className="mt-1 block text-sm text-muted">{venue.address}</span>
                    <span className="mt-2 block max-w-xl text-sm leading-relaxed">{venue.summary}</span>
                  </span>
                  <span className="text-sm text-muted">
                    {count} {count === 1 ? 'listing' : 'listings'}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
