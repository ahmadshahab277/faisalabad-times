import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCity } from '../context/CityContext'
import { availabilityLabel, isSoldOut } from '../lib/booking'
import { dayNumber, formatFromPrice, formatTime, monthName, toIso, weekdayName } from '../lib/format'
import { cx } from '../lib/classNames'
import type { CityEvent } from '../types'

const ease = [0.22, 1, 0.36, 1] as const

export function Timeline({ events }: { events: CityEvent[] }) {
  const reduce = useReducedMotion()
  const { venues, bookings } = useCity()
  const today = toIso(new Date())
  const groups = new Map<string, CityEvent[]>()
  for (const event of events) {
    const list = groups.get(event.startDate) ?? []
    list.push(event)
    groups.set(event.startDate, list)
  }

  if (events.length === 0) {
    return <p className="border-t border-line py-8 text-sm text-muted">Nothing upcoming in the sample calendar.</p>
  }

  return (
    <ol>
      {[...groups.entries()].map(([date, items]) => (
        <motion.li
          key={date}
          className="grid gap-2 border-t border-line py-5 md:grid-cols-[120px_minmax(0,1fr)] md:gap-8"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -8% 0px' }}
          transition={{ duration: reduce ? 0.12 : 0.4, ease }}
        >
          <time dateTime={date} className="flex items-baseline gap-2 md:block">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
              {date === today ? 'Today' : weekdayName(date)}
            </span>
            <span className="mt-1 block text-3xl font-semibold tracking-tight">{dayNumber(date)}</span>
            <motion.span
              className="mt-2 hidden h-px w-7 origin-left bg-ink md:block"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0.12 : 0.35, delay: reduce ? 0 : 0.12, ease }}
            />
            <span className="text-sm text-muted">{monthName(date)}</span>
          </time>
          <ul className="divide-y divide-line/80">
            {items.map((event, index) => {
              const venue = venues.find((item) => item.id === event.venueId)
              const soldOut = isSoldOut(event, bookings)
              return (
                <motion.li
                  key={event.id}
                  className="grid gap-3 py-3 md:grid-cols-[minmax(0,1.4fr)_140px_150px_120px] md:items-center"
                  initial={reduce ? false : { opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                  transition={{ duration: reduce ? 0.12 : 0.35, delay: reduce ? 0 : index * 0.05, ease }}
                >
                  <div className="min-w-0">
                    <Link to={`/events/${event.slug}`} className="font-semibold tracking-tight hover:underline">
                      {event.title}
                    </Link>
                    <p className="text-sm text-muted md:hidden">
                      {formatTime(event.time)} · {venue?.name}
                    </p>
                  </div>
                  <p className="hidden text-sm text-muted md:block">{formatTime(event.time)}</p>
                  <p className="hidden text-sm text-muted md:block">
                    {venue?.areaLabel}
                  </p>
                  <div className="flex items-center justify-between gap-3 md:justify-end">
                    <span className="text-sm font-medium">{formatFromPrice(event.priceFrom)}</span>
                    {soldOut ? (
                      <span className="text-sm text-clay">Sold out</span>
                    ) : (
                      <Link to={`/events/${event.slug}/book`} className={cx('text-sm font-semibold underline decoration-lime decoration-2 underline-offset-4')}>
                        Book
                      </Link>
                    )}
                    <span className="sr-only">{availabilityLabel(event, bookings)}</span>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        </motion.li>
      ))}
    </ol>
  )
}
