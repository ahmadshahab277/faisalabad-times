import { useReducedMotion } from 'framer-motion'
import { Search } from 'lucide-react'
import { areas, categories } from '../services/catalog'
import type { DateFilter, EventFilters } from '../types'
import { cx, fieldClass } from '../lib/classNames'

const dates: Array<{ id: DateFilter; label: string }> = [
  { id: 'any', label: 'Any date' },
  { id: 'today', label: 'Today' },
  { id: 'weekend', label: 'This Weekend' },
  { id: 'month', label: 'This Month' },
  { id: 'custom', label: 'Custom Date' },
]

export function FilterBar({
  filters,
  onChange,
}: {
  filters: EventFilters
  onChange: (next: EventFilters) => void
}) {
  const reduce = useReducedMotion()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Chip active={filters.category === 'all'} reduce={reduce} onClick={() => onChange({ ...filters, category: 'all' })}>
          All
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.id}
            active={filters.category === category.id}
            reduce={reduce}
            onClick={() => onChange({ ...filters, category: category.id })}
          >
            {category.label}
          </Chip>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
        <label className="relative block">
          <span className="sr-only">Search events</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            placeholder="Search events in Faisalabad..."
            className={cx(fieldClass, 'pl-9')}
          />
        </label>
        <label className="block">
          <span className="sr-only">Location</span>
          <select
            value={filters.area}
            onChange={(event) =>
              onChange({ ...filters, area: event.target.value as EventFilters['area'] })
            }
            className={fieldClass}
          >
            <option value="all">All Faisalabad</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 rounded-full border border-line bg-white p-1">
          {dates.map((date) => (
            <button
              key={date.id}
              type="button"
              onClick={() => onChange({ ...filters, when: date.id })}
              className={cx(
                'rounded-full px-3 py-1.5 text-sm',
                filters.when === date.id ? 'bg-ink font-semibold text-white' : 'text-muted hover:text-ink',
              )}
            >
              {date.label}
            </button>
          ))}
        </div>
        {filters.when === 'custom' && (
          <input
            type="date"
            value={filters.customDate}
            aria-label="Custom date"
            onChange={(event) => onChange({ ...filters, customDate: event.target.value })}
            className={cx(fieldClass, 'w-auto')}
          />
        )}
      </div>
    </div>
  )
}

function Chip({
  active,
  reduce,
  children,
  onClick,
}: {
  active: boolean
  reduce: boolean | null
  children: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'relative shrink-0 rounded-full border px-3 py-1.5 text-sm transition-transform',
        active
          ? 'border-ink bg-ink font-semibold text-white'
          : 'border-line bg-white text-ink hover:border-ink motion-safe:hover:-translate-y-0.5',
        !reduce && 'transition-colors duration-300',
      )}
    >
      <span className="relative">{children}</span>
    </button>
  )
}
