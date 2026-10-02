export type CategoryId =
  | 'concerts'
  | 'workshops'
  | 'business'
  | 'food'
  | 'sports'
  | 'family'
  | 'education'
  | 'community'

export type AreaId =
  | 'd-ground'
  | 'canal-road'
  | 'clock-tower'
  | 'kohinoor-city'
  | 'lyallpur-galleria'
  | 'chen-one-road'
  | 'university'

export type Availability = 'open' | 'selling-fast' | 'limited' | 'sold-out'

export type DateFilter = 'any' | 'today' | 'weekend' | 'month' | 'custom'

export interface TicketTier {
  id: string
  name: string
  price: number
  detail: string
  remaining: number
}

export interface CityEvent {
  id: string
  slug: string
  title: string
  category: CategoryId
  summary: string
  description: string
  goodToKnow: string[]
  image: string
  startDate: string
  endDate: string
  time: string
  venueId: string
  priceFrom: number
  availability: Availability
  featured: boolean
  featuredOrder: number
  sample: boolean
  submitted?: boolean
  tickets: TicketTier[]
}

export interface Venue {
  id: string
  slug: string
  name: string
  area: AreaId
  areaLabel: string
  address: string
  summary: string
  image: string
  capacity: string
}

export interface Category {
  id: CategoryId
  label: string
  description: string
}

export interface Area {
  id: AreaId
  label: string
}

export interface EventFilters {
  query: string
  category: CategoryId | 'all'
  area: AreaId | 'all'
  when: DateFilter
  customDate: string
}

export interface Booking {
  id: string
  reference: string
  eventId: string
  eventSlug: string
  eventTitle: string
  eventImage: string
  dateLabel: string
  time: string
  venueName: string
  areaLabel: string
  tierId: string
  tierName: string
  unitPrice: number
  quantity: number
  total: number
  name: string
  email: string
  phone: string
  paymentNote?: string
  createdAt: string
}

export interface ListingInput {
  title: string
  category: CategoryId
  venueId: string
  startDate: string
  time: string
  price: number
  summary: string
  organizer: string
  email: string
}
