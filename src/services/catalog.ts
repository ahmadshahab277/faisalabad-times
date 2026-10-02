import areasData from '../data/areas.json'
import categoriesData from '../data/categories.json'
import eventsData from '../data/events.json'
import venuesData from '../data/venues.json'
import type { Area, Category, CategoryId, CityEvent, Venue } from '../types'

export const catalogueEvents = eventsData as CityEvent[]
export const venues = venuesData as Venue[]
export const categories = categoriesData as Category[]
export const areas = areasData as Area[]

export const categoryImage: Record<CategoryId, string> = {
  concerts: '/images/concert-zafar.jpg',
  workshops: '/images/workshop.jpg',
  business: '/images/summit.jpg',
  food: '/images/kitchen.jpg',
  sports: '/images/cricket-play.jpg',
  family: '/images/kids.jpg',
  education: '/images/office.jpg',
  community: '/images/camera.jpg',
}

const categoryLabels = new Map(categories.map((category) => [category.id, category.label]))

export function categoryLabel(id: CategoryId) {
  return categoryLabels.get(id) ?? id
}

export function getVenue(id: string) {
  return venues.find((venue) => venue.id === id)
}
