import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useCity } from '../context/CityContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { categories } from '../services/catalog'

export function CategoriesPage() {
  usePageTitle('Categories')
  const { events } = useCity()

  return (
    <>
      <PageHeader
        eyebrow="CATEGORIES"
        title="What kind of evening"
        lede="Eight ways the sample calendar is organised, from Canal Road concerts to Sunday workshops."
      />
      <div className="mx-auto max-w-[1240px] px-4 pb-16 md:px-6">
        <ul className="border-t border-line">
          {categories.map((category) => {
            const matching = events.filter((event) => event.category === category.id)
            const image = matching[0]?.image
            return (
              <li key={category.id} className="border-b border-line">
                <Link
                  to={`/events?category=${category.id}`}
                  className="grid items-center gap-5 py-5 md:grid-cols-[160px_minmax(0,1fr)_auto]"
                >
                  {image && <img src={image} alt="" className="h-24 w-full rounded-2xl object-cover md:h-28" />}
                  <span>
                    <span className="block text-xl font-semibold tracking-tight">{category.label}</span>
                    <span className="mt-1 block max-w-xl text-sm leading-relaxed text-muted">{category.description}</span>
                  </span>
                  <span className="text-sm text-muted">
                    {matching.length} {matching.length === 1 ? 'event' : 'events'}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
