import { Link, useParams } from 'react-router-dom'
import { EventCard } from '../components/EventCard'
import { useCity } from '../context/CityContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { toIso } from '../lib/format'
import { NotFoundPage } from './NotFoundPage'

export function VenueDetailPage() {
  const { slug } = useParams()
  const { venues, events } = useCity()
  const venue = venues.find((item) => item.slug === slug)
  usePageTitle(venue?.name ?? 'Venue')
  if (!venue) return <NotFoundPage />

  const today = toIso(new Date())
  const upcoming = events.filter((event) => event.venueId === venue.id && event.endDate >= today)

  return (
    <article className="mx-auto max-w-[1240px] px-4 py-10 md:px-6 md:py-14">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">{venue.areaLabel}</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">{venue.name}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{venue.summary}</p>
      <img src={venue.image} alt={venue.name} className="mt-8 aspect-[16/8] w-full rounded-3xl object-cover" />
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted">Address</dt>
          <dd className="mt-1 font-medium">{venue.address}</dd>
        </div>
        <div>
          <dt className="text-muted">Scale</dt>
          <dd className="mt-1 font-medium">{venue.capacity}</dd>
        </div>
        <div>
          <dt className="text-muted">Listings</dt>
          <dd className="mt-1 font-medium">{upcoming.length} upcoming</dd>
        </div>
      </dl>
      <section className="mt-12" aria-labelledby="venue-events">
        <h2 id="venue-events" className="text-2xl font-semibold tracking-tight">
          On the calendar
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No upcoming sample listings at this place.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} venue={venue} />
            ))}
          </div>
        )}
      </section>
      <Link to="/venues" className="mt-10 inline-block text-sm font-semibold underline decoration-lime decoration-2 underline-offset-4">
        All venues
      </Link>
    </article>
  )
}
