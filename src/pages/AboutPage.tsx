import { Link } from 'react-router-dom'
import { buttonClass } from '../lib/classNames'
import { usePageTitle } from '../hooks/usePageTitle'

const places = [
  ['D-Ground', 'Civil Lines lawn for festivals and daytime sport.'],
  ['Canal Road', 'Evening music and bazaars along the canal.'],
  ['Clock Tower', 'Walks and family programmes beside Ghanta Ghar.'],
  ['Kohinoor City', 'Seated halls for summits and small breakfasts.'],
  ['Lyallpur Galleria', 'Atrium exhibitions, pop-up kitchens, story hour.'],
  ['Chen One Road', 'Workshops tied to cloth, tools, and export samples.'],
  ['University area', 'Talks and meetups off Susan Road. Not campus-official.'],
]

export function AboutPage() {
  usePageTitle('About')
  return (
    <article className="mx-auto max-w-[1240px] px-4 py-12 md:px-6 md:py-16">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted">ABOUT</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
        What’s Happening in Faisalabad.
      </h1>
      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="max-w-xl space-y-4 text-base leading-relaxed text-ink/85">
          <p>
            Faisalabad Times is a city guide for concerts, workshops, food gatherings, business mornings, and family days.
            The names on the calendar are sample programmes, placed in real parts of the city so the product can be tried properly.
          </p>
          <p>
            Reservations stay in this browser. Nothing is charged, and no venue is told you are coming. When a booking service is connected, the same screens are where a seat would be held.
          </p>
          <p>
            If you organise something, send it through List Your Event. It appears on this device only, under your listings.
          </p>
        </div>
        <dl className="border-t border-line">
          {places.map(([place, note]) => (
            <div key={place} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[140px_1fr]">
              <dt className="text-sm font-semibold">{place}</dt>
              <dd className="text-sm text-muted">{note}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/events" className={buttonClass('ink')}>
          Explore Events
        </Link>
        <Link to="/list" className={buttonClass('line')}>
          List Your Event
        </Link>
      </div>
    </article>
  )
}
