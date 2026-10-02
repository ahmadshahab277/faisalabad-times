import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EventGrid } from '../components/EventGrid'
import { FilterBar } from '../components/FilterBar'
import { PageHeader } from '../components/PageHeader'
import { useCity } from '../context/CityContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { filterEvents } from '../lib/filters'
import { areas, categories } from '../services/catalog'
import type { AreaId, CategoryId, DateFilter, EventFilters } from '../types'

const categoryIds = new Set(categories.map((category) => category.id))
const areaIds = new Set(areas.map((area) => area.id))
const dateIds = new Set<DateFilter>(['any', 'today', 'weekend', 'month', 'custom'])

function readFilters(params: URLSearchParams): EventFilters {
  const category = params.get('category')
  const area = params.get('area')
  const when = params.get('when')
  return {
    query: params.get('q') ?? '',
    category: category && categoryIds.has(category as CategoryId) ? (category as CategoryId) : 'all',
    area: area && areaIds.has(area as AreaId) ? (area as AreaId) : 'all',
    when: when && dateIds.has(when as DateFilter) ? (when as DateFilter) : 'any',
    customDate: params.get('date') ?? '',
  }
}

export function EventsPage() {
  usePageTitle('Events')
  const { events, venues } = useCity()
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => readFilters(params), [params])
  const matched = filterEvents(events, venues, filters)

  function update(next: EventFilters) {
    const query = new URLSearchParams()
    if (next.query.trim()) query.set('q', next.query.trim())
    if (next.category !== 'all') query.set('category', next.category)
    if (next.area !== 'all') query.set('area', next.area)
    if (next.when !== 'any') query.set('when', next.when)
    if (next.when === 'custom' && next.customDate) query.set('date', next.customDate)
    setParams(query, { replace: true })
  }

  return (
    <>
      <PageHeader
        eyebrow="EVENTS"
        title="What’s on in Faisalabad"
        lede="Sample listings across D-Ground, Canal Road, the Clock Tower, Kohinoor City, Lyallpur Galleria, Chen One Road, and the university area."
      />
      <div className="mx-auto max-w-[1240px] px-4 pb-16 md:px-6">
        <FilterBar filters={filters} onChange={update} />
        <p className="mt-6 text-sm text-muted">
          {matched.length} {matched.length === 1 ? 'event' : 'events'}
        </p>
        <div className="mt-6">
          <EventGrid
            events={matched}
            venues={venues}
            filterKey={filters.category}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            empty="Nothing in the sample calendar matches that. Clear a filter or try another day."
          />
        </div>
      </div>
    </>
  )
}
