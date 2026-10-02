import type { CityEvent, EventFilters, Venue } from '../types'
import { toIso } from './format'

export const emptyFilters: EventFilters = {
  query: '',
  category: 'all',
  area: 'all',
  when: 'any',
  customDate: '',
}

function weekendRange(now: Date) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const day = start.getDay()
  const saturday = new Date(start)
  if (day === 0) saturday.setDate(start.getDate() - 1)
  else saturday.setDate(start.getDate() + ((6 - day) % 7))
  const sunday = new Date(saturday)
  sunday.setDate(saturday.getDate() + 1)
  return { start: toIso(saturday), end: toIso(sunday) }
}

function monthRange(now: Date) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { start: toIso(start), end: toIso(end) }
}

function overlaps(event: CityEvent, start: string, end: string) {
  return event.startDate <= end && event.endDate >= start
}

export function filterEvents(
  events: CityEvent[],
  venues: Venue[],
  filters: EventFilters,
  now = new Date(),
) {
  const today = toIso(now)
  const venueById = new Map(venues.map((venue) => [venue.id, venue]))
  const query = filters.query.trim().toLowerCase()

  let range: { start: string; end: string } | null = null
  if (filters.when === 'today') range = { start: today, end: today }
  if (filters.when === 'weekend') range = weekendRange(now)
  if (filters.when === 'month') range = monthRange(now)
  if (filters.when === 'custom' && filters.customDate) {
    range = { start: filters.customDate, end: filters.customDate }
  }

  return events
    .filter((event) => event.endDate >= today)
    .filter((event) => (range ? overlaps(event, range.start, range.end) : true))
    .filter((event) => (filters.category === 'all' ? true : event.category === filters.category))
    .filter((event) => {
      if (filters.area === 'all') return true
      return venueById.get(event.venueId)?.area === filters.area
    })
    .filter((event) => {
      if (!query) return true
      const venue = venueById.get(event.venueId)
      const haystack = [event.title, event.summary, event.description, venue?.name, venue?.areaLabel, event.category]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.time.localeCompare(b.time))
}
