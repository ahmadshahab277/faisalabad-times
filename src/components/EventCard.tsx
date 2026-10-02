import { useReducedMotion } from 'framer-motion'
import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCity } from '../context/CityContext'
import { availabilityLabel, isSoldOut } from '../lib/booking'
import { buttonClass, cx } from '../lib/classNames'
import { formatEventDate, formatFromPrice, formatTime } from '../lib/format'
import { categoryLabel } from '../services/catalog'
import type { CityEvent, Venue } from '../types'
import { useFinePointer } from './bits/useFinePointer'

export function EventCard({
  event,
  venue,
  variant = 'grid',
  className,
}: {
  event: CityEvent
  venue: Venue
  variant?: 'grid' | 'lead' | 'feature'
  className?: string
}) {
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const { bookings } = useCity()
  const soldOut = isSoldOut(event, bookings)
  const status = availabilityLabel(event, bookings)
  const lead = variant === 'lead'
  const tilt = Boolean(fine && !reduce)

  function onMove(native: MouseEvent<HTMLElement>) {
    if (!tilt) return
    const el = native.currentTarget
    const rect = el.getBoundingClientRect()
    const x = native.clientX - rect.left
    const y = native.clientY - rect.top
    const rotateX = (0.5 - y / rect.height) * 8
    const rotateY = (x / rect.width - 0.5) * 8
    el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`
    el.style.setProperty('--sx', `${x}px`)
    el.style.setProperty('--sy', `${y}px`)
  }

  function onLeave(native: MouseEvent<HTMLElement>) {
    native.currentTarget.style.transform = ''
  }

  return (
    <article
      onMouseMove={tilt ? onMove : undefined}
      onMouseLeave={tilt ? onLeave : undefined}
      className={cx(
        'event-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_10px_30px_rgba(20,20,20,0.03)]',
        className,
      )}
    >
      <span className="event-spot pointer-events-none absolute inset-0 z-10 opacity-0" aria-hidden="true" />
      <Link to={`/events/${event.slug}`} className={cx('relative block overflow-hidden', lead ? 'min-h-[240px] flex-1' : '')}>
        <img
          src={event.image}
          alt={event.title}
          className={cx('event-photo w-full object-cover', lead ? 'h-full min-h-[240px]' : 'aspect-[3/2]')}
        />
      </Link>
      <div className={cx('relative z-[1] flex flex-1 flex-col', lead ? 'p-5 md:p-6' : 'p-4 md:p-5')}>
        <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
          {event.submitted ? 'Your listing' : categoryLabel(event.category)}
        </p>
        <h3 className={cx('mt-2 font-semibold tracking-tight', lead ? 'text-2xl md:text-3xl' : 'text-lg')}>
          <Link to={`/events/${event.slug}`} className="hover:underline">
            {event.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted">
          <time dateTime={event.startDate}>{formatEventDate(event.startDate, event.endDate)}</time>
          <span> · {formatTime(event.time)}</span>
        </p>
        <p className="text-sm text-muted">
          {venue.name}
          <span> · {venue.areaLabel}</span>
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="text-sm font-semibold">{formatFromPrice(event.priceFrom)}</p>
          <p className={cx('text-sm', status === 'Sold out' || status === 'Few seats left' ? 'text-clay' : 'text-muted')}>
            {status}
          </p>
        </div>
        <div className="mt-4 lg:mt-0 lg:grid lg:grid-rows-[0fr] lg:opacity-0 lg:transition-all lg:duration-300 lg:group-hover:mt-4 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100 lg:group-focus-within:mt-4 lg:group-focus-within:grid-rows-[1fr] lg:group-focus-within:opacity-100">
          <div className="overflow-hidden">
            {soldOut ? (
              <span className={cx(buttonClass('line'), 'w-full')}>Sold out</span>
            ) : (
              <Link to={`/events/${event.slug}/book`} className={cx(buttonClass('ink'), 'w-full')}>
                Book Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
