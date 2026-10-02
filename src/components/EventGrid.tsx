import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EventCard } from './EventCard'
import type { CityEvent, Venue } from '../types'

const ease = [0.22, 1, 0.36, 1] as const

export function EventGrid({
  events,
  venues,
  filterKey,
  className,
  empty,
}: {
  events: CityEvent[]
  venues: Venue[]
  filterKey: string
  className: string
  empty: string
}) {
  const reduce = useReducedMotion()

  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={filterKey}
        initial={{ opacity: 0, y: reduce ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0 }}
        transition={{ duration: reduce ? 0.12 : 0.28, ease }}
      >
        {events.length === 0 ? (
          <p className="text-sm text-muted">{empty}</p>
        ) : (
          <div className={className}>
            {events.map((event) => {
              const venue = venues.find((item) => item.id === event.venueId)
              if (!venue) return null
              return <EventCard key={event.id} event={event} venue={venue} />
            })}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
