import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandSlider } from '../components/BrandSlider'
import { JoinLanyard } from '../components/JoinLanyard'
import PaperCrumple from '../components/PaperCrumple'
import { EventCard } from '../components/EventCard'
import { EventGrid } from '../components/EventGrid'
import { FilterBar } from '../components/FilterBar'
import { Hero } from '../components/Hero'
import { Timeline } from '../components/Timeline'
import { Reveal } from '../components/bits/Reveal'
import { useCity } from '../context/CityContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { emptyFilters, filterEvents } from '../lib/filters'

export function HomePage() {
  usePageTitle('Home')
  const { events, venues } = useCity()
  const [filters, setFilters] = useState(emptyFilters)
  const featured = events.filter((event) => event.featured).sort((a, b) => a.featuredOrder - b.featuredOrder)
  const matched = filterEvents(events, venues, filters)
  const untouched =
    !filters.query && filters.category === 'all' && filters.area === 'all' && filters.when === 'any'
  const discovery = (untouched ? matched.filter((event) => !event.featured) : matched).slice(0, 6)
  const upcoming = filterEvents(events, venues, emptyFilters)
  const places = venues.slice(0, 4)

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-[1240px] px-4 py-16 md:px-6 md:py-24" aria-labelledby="featured-heading">
        <div className="max-w-2xl">
          <Reveal>
            <h2 id="featured-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
              Featured in Faisalabad
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-3 text-muted">The live concert, The Spotlight Show, and nights in the same spirit.</p>
          </Reveal>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-6">
          {featured.map((event, index) => {
            const venue = venues.find((item) => item.id === event.venueId)
            if (!venue) return null
            const span =
              index === 0 ? 'lg:col-span-4 lg:row-span-2' : index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'
            return (
              <Reveal key={event.id} className={span} delay={0.16 + index * 0.07}>
                <EventCard
                  event={event}
                  venue={venue}
                  variant={index === 0 ? 'lead' : 'feature'}
                  className="h-full"
                />
              </Reveal>
            )
          })}
        </div>
      </section>

      <section id="discover" className="mx-auto max-w-[1240px] px-4 pb-16 md:px-6 md:pb-24" aria-labelledby="discover-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 id="discover-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
              Find Your Next Experience
            </h2>
            <p className="mt-3 text-muted">Filter by what you feel like, where in the city, and when you’re free.</p>
          </div>
          <Link to="/events" className="text-sm font-semibold underline decoration-lime decoration-2 underline-offset-4">
            All events
          </Link>
        </div>
        <div className="mt-8">
          <FilterBar filters={filters} onChange={setFilters} />
        </div>
        <div className="mt-8">
          <EventGrid
            events={discovery}
            venues={venues}
            filterKey={filters.category}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            empty="Nothing in the sample calendar matches that."
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-16 md:px-6 md:pb-24" aria-labelledby="upcoming-heading">
        <div className="max-w-2xl">
          <h2 id="upcoming-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
            Upcoming in Faisalabad
          </h2>
          <p className="mt-3 text-muted">Today through the rest of October.</p>
        </div>
        <div className="mt-8">
          <Timeline events={upcoming} />
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-8 md:px-6" aria-labelledby="places-heading">
        <div className="flex items-end justify-between gap-4">
          <h2 id="places-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
            Places in the city
          </h2>
          <Link to="/venues" className="text-sm font-semibold underline decoration-lime decoration-2 underline-offset-4">
            All venues
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {places.map((venue) => (
            <Link key={venue.id} to={`/venues/${venue.slug}`} className="group block">
              <span className="block overflow-hidden rounded-2xl">
                <img
                  src={venue.image}
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </span>
              <p className="mt-3 font-semibold tracking-tight">{venue.name}</p>
              <p className="text-sm text-muted">{venue.areaLabel}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] items-center gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">A SAMPLE PRINT</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Hold the ticket. Let it go.</h2>
          <p className="mt-4 text-muted">
            Danyal Zafar and Zoha Waseem, Sunday 4 October, 6:00 PM in Faisalabad. Early bird is PKR 3,500. Press the
            poster and drag it. Release, and the paper smooths flat.
          </p>
          <Link
            to="/events/danyal-zafar-zoha-waseem"
            className="mt-6 inline-flex text-sm font-semibold underline decoration-lime decoration-2 underline-offset-4"
          >
            Book the concert
          </Link>
        </div>
        <PaperCrumple
          src="/images/concert-zafar.jpg"
          alt="Danyal Zafar and Zoha Waseem live in Faisalabad"
          width={400}
          height={400}
          sceneHeight={360}
          releaseBehavior="restore"
          crumpleAmount={0.85}
          crumpleDuration={0.55}
          releaseDuration={0.4}
          foldCount={6}
          foldSharpness={0.6}
          wrinkleDepth={0.65}
          creaseStrength={0.18}
          paperColor="#f4f0e8"
          paperTexture={0.08}
          draggable
          returnToOrigin
          imageFit="contain"
          roughness={0.92}
          lightIntensity={1.8}
          lightAngle={-35}
          shadow
          shadowOpacity={0.16}
          dragRotation={10}
          dragRadius={180}
          rotation={0}
          seed={7}
          detail={64}
          disabled={false}
        />
      </section>

      <BrandSlider />
      <JoinLanyard />
    </>
  )
}
