import type { Booking, CityEvent, TicketTier } from '../types'

export function seatsLeft(tier: TicketTier, bookings: Booking[], eventId: string) {
  const used = bookings
    .filter((booking) => booking.eventId === eventId && booking.tierId === tier.id)
    .reduce((sum, booking) => sum + booking.quantity, 0)
  return Math.max(0, tier.remaining - used)
}

export function isSoldOut(event: CityEvent, bookings: Booking[]) {
  if (event.availability === 'sold-out') return true
  return event.tickets.every((tier) => seatsLeft(tier, bookings, event.id) === 0)
}

export function availabilityLabel(event: CityEvent, bookings: Booking[]) {
  if (isSoldOut(event, bookings)) return 'Sold out'
  if (event.availability === 'selling-fast') return 'Selling fast'
  if (event.availability === 'limited') return 'Few seats left'
  return 'Seats open'
}
