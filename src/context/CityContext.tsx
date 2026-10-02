import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { categoryImage, catalogueEvents, venues } from '../services/catalog'
import type { Booking, CityEvent, ListingInput } from '../types'
import { slugify } from '../lib/format'

const BOOKING_KEY = 'ft-bookings'
const LISTING_KEY = 'ft-listings'

interface CityContextValue {
  events: CityEvent[]
  venues: typeof venues
  bookings: Booking[]
  reserve: (booking: Booking) => void
  cancelBooking: (id: string) => void
  submitListing: (input: ListingInput) => CityEvent
}

const CityContext = createContext<CityContextValue | null>(null)

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function CityProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [listings, setListings] = useState<CityEvent[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setBookings(readStorage<Booking[]>(BOOKING_KEY, []))
    setListings(readStorage<CityEvent[]>(LISTING_KEY, []))
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings))
  }, [bookings, ready])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(LISTING_KEY, JSON.stringify(listings))
  }, [listings, ready])

  const value = useMemo<CityContextValue>(() => {
    return {
      events: [...listings, ...catalogueEvents],
      venues,
      bookings,
      reserve(booking) {
        setBookings((current) => [booking, ...current])
      },
      cancelBooking(id) {
        setBookings((current) => current.filter((booking) => booking.id !== id))
      },
      submitListing(input) {
        const base = slugify(input.title)
        const taken = new Set([...catalogueEvents, ...listings].map((event) => event.slug))
        let slug = base
        let n = 2
        while (taken.has(slug)) {
          slug = `${base}-${n}`
          n += 1
        }
        const event: CityEvent = {
          id: `listing-${crypto.randomUUID()}`,
          slug,
          title: input.title.trim(),
          category: input.category,
          summary: input.summary.trim(),
          description: `${input.summary.trim()} Listed by ${input.organizer.trim()} in this browser. It is not published to a public calendar yet.`,
          goodToKnow: ['Saved on this device', 'Your listing'],
          image: categoryImage[input.category],
          startDate: input.startDate,
          endDate: input.startDate,
          time: input.time,
          venueId: input.venueId,
          priceFrom: input.price,
          availability: 'open',
          featured: false,
          featuredOrder: 0,
          sample: false,
          submitted: true,
          tickets: [
            {
              id: 'general',
              name: 'General',
              price: input.price,
              detail: 'Added with your listing.',
              remaining: 40,
            },
          ],
        }
        setListings((current) => [event, ...current])
        return event
      },
    }
  }, [bookings, listings])

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>
}

export function useCity() {
  const value = useContext(CityContext)
  if (!value) throw new Error('useCity must be used within CityProvider')
  return value
}
