import { motion, useReducedMotion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { EventCard } from '../components/EventCard'
import { useFinePointer } from '../components/bits/useFinePointer'
import { useCity } from '../context/CityContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { availabilityLabel, isSoldOut } from '../lib/booking'
import { buttonClass, cx } from '../lib/classNames'
import { formatEventDate, formatFromPrice, formatPrice, formatTime, toIso } from '../lib/format'
import { categoryLabel } from '../services/catalog'
import { NotFoundPage } from './NotFoundPage'

export function EventDetailPage() {
  const { slug } = useParams()
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const { events, venues, bookings } = useCity()
  const event = events.find((item) => item.slug === slug)
  const venue = venues.find((item) => item.id === event?.venueId)
  usePageTitle(event?.title ?? 'Event')

  if (!event || !venue) return <NotFoundPage />

  const soldOut = isSoldOut(event, bookings)
  const ease = [0.22, 1, 0.36, 1] as const
  const hover = Boolean(fine && !reduce)
  const today = toIso(new Date())
  const related = events
    .filter((item) => item.category === event.category && item.id !== event.id && item.endDate >= today)
    .slice(0, 3)

  return (
    <article className="mx-auto max-w-[1240px] px-4 py-10 md:px-6 md:py-14">
      <motion.p
        className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {event.submitted ? 'Your listing' : event.sample ? 'Sample listing' : 'Live listing'} · {categoryLabel(event.category)}
      </motion.p>
      <div className="mt-3 grid items-start gap-10 lg:grid-cols-[minmax(0,1.45fr)_340px]">
        <div>
          <motion.h1
            className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.35, delay: reduce ? 0 : 0.2, ease }}
          >
            {event.title}
          </motion.h1>
          <motion.p
            className="mt-4 max-w-2xl text-lg leading-relaxed text-muted"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.35, delay: reduce ? 0 : 0.32, ease }}
          >
            {event.summary}
          </motion.p>
          <motion.div
            className="mt-8 overflow-hidden rounded-3xl"
            initial={reduce ? false : { opacity: 0, clipPath: 'inset(12% 0% 12% 0% round 24px)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
            transition={{ duration: reduce ? 0.15 : 0.45, ease }}
          >
            <img src={event.image} alt={event.title} className="aspect-[16/9] w-full object-cover" />
          </motion.div>
          <div className="mt-8 max-w-2xl">
            <h2 className="text-xl font-semibold tracking-tight">About this listing</h2>
            <p className="mt-3 leading-relaxed text-ink/80">{event.description}</p>
            <ul className="mt-6 space-y-2 border-t border-line pt-6">
              {event.goodToKnow.map((item) => (
                <li key={item} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <motion.aside
          className="rounded-3xl border border-line bg-white p-5 lg:sticky lg:top-24"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={hover ? { y: -3 } : undefined}
          transition={{ duration: reduce ? 0.15 : 0.35, delay: reduce ? 0 : 0.36, ease }}
        >
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-muted">When</dt>
              <dd className="mt-1 font-semibold">
                <time dateTime={event.startDate}>{formatEventDate(event.startDate, event.endDate)}</time>
                <span> · {formatTime(event.time)}</span>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Where</dt>
              <dd className="mt-1 font-semibold">
                <Link to={`/venues/${venue.slug}`} className="underline decoration-lime decoration-2 underline-offset-4">
                  {venue.name}
                </Link>
              </dd>
              <dd className="text-muted">{venue.address}</dd>
            </div>
            <div>
              <dt className="text-muted">From</dt>
              <dd className="mt-1 font-semibold">{formatFromPrice(event.priceFrom)}</dd>
            </div>
            <div>
              <dt className="text-muted">Availability</dt>
              <dd className={cx('mt-1 font-semibold', soldOut ? 'text-clay' : '')}>{availabilityLabel(event, bookings)}</dd>
            </div>
          </dl>
          <ul className="mt-5 space-y-2 border-t border-line pt-5">
            {event.tickets.map((tier) => (
              <li key={tier.id} className="flex items-start justify-between gap-3 text-sm">
                <span>
                  <span className="block font-medium">{tier.name}</span>
                  <span className="text-muted">{tier.detail}</span>
                </span>
                <span className="shrink-0 font-semibold">{formatPrice(tier.price)}</span>
              </li>
            ))}
          </ul>
          {soldOut ? (
            <p className={cx(buttonClass('line'), 'mt-5 w-full')}>Sold out</p>
          ) : (
            <Link to={`/events/${event.slug}/book`} className={cx(buttonClass('ink'), 'mt-5 w-full')}>
              Reserve seats
            </Link>
          )}
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Saved on this device. No payment is taken in the demo.
          </p>
        </motion.aside>
      </div>
      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-semibold tracking-tight">
            Also in {categoryLabel(event.category)}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {related.map((item) => {
              const relatedVenue = venues.find((place) => place.id === item.venueId)
              if (!relatedVenue) return null
              return <EventCard key={item.id} event={item} venue={relatedVenue} />
            })}
          </div>
        </section>
      )}
    </article>
  )
}
