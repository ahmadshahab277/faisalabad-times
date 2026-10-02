import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useCity } from '../context/CityContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { buttonClass, fieldClass } from '../lib/classNames'
import { toIso } from '../lib/format'
import { categories } from '../services/catalog'
import type { CategoryId, CityEvent } from '../types'

export function ListEventPage() {
  usePageTitle('List Your Event')
  const { venues, submitListing } = useCity()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<CategoryId>('community')
  const [venueId, setVenueId] = useState(venues[0]?.id ?? '')
  const [startDate, setStartDate] = useState('')
  const [time, setTime] = useState('18:00')
  const [price, setPrice] = useState('0')
  const [summary, setSummary] = useState('')
  const [organizer, setOrganizer] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [created, setCreated] = useState<CityEvent | null>(null)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (title.trim().length < 4) next.title = 'Give the event a name.'
    if (!startDate) next.startDate = 'Pick a date.'
    else if (startDate < toIso(new Date())) next.startDate = 'Pick today or a later date.'
    if (!time) next.time = 'Add a start time.'
    const amount = Number(price)
    if (!Number.isFinite(amount) || amount < 0) next.price = 'Use 0 for a free listing, or a price in rupees.'
    if (summary.trim().length < 20) next.summary = 'Write a short description, at least a sentence.'
    if (organizer.trim().length < 2) next.organizer = 'Add the organizer’s name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email.'
    if (!venueId) next.venueId = 'Choose a place.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const listing = submitListing({
      title,
      category,
      venueId,
      startDate,
      time,
      price: Math.round(amount),
      summary,
      organizer,
      email,
    })
    setCreated(listing)
  }

  if (created) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">LISTING SAVED</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{created.title}</h1>
        <p className="mt-3 leading-relaxed text-muted">
          It’s on this device now, in the events list. It is not published anywhere else.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`/events/${created.slug}`} className={buttonClass('ink')}>
            View listing
          </Link>
          <Link to="/events" className={buttonClass('line')}>
            All events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="LIST YOUR EVENT"
        title="Put something on the calendar"
        lede="Tell us what, where, and when. The listing is stored in this browser and uses a photo from its category until uploads are connected."
      />
      <form onSubmit={onSubmit} noValidate className="mx-auto grid max-w-[720px] gap-4 px-4 pb-16 md:px-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Event name</span>
          <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} />
          {errors.title && <span className="mt-1 block text-sm text-clay">{errors.title}</span>}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Category</span>
            <select className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value as CategoryId)}>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Place</span>
            <select className={fieldClass} value={venueId} onChange={(e) => setVenueId(e.target.value)}>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Date</span>
            <input type="date" className={fieldClass} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            {errors.startDate && <span className="mt-1 block text-sm text-clay">{errors.startDate}</span>}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Time</span>
            <input type="time" className={fieldClass} value={time} onChange={(e) => setTime(e.target.value)} />
            {errors.time && <span className="mt-1 block text-sm text-clay">{errors.time}</span>}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Price in Rs</span>
            <input className={fieldClass} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
            {errors.price && <span className="mt-1 block text-sm text-clay">{errors.price}</span>}
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Short description</span>
          <textarea
            className="min-h-28 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          {errors.summary && <span className="mt-1 block text-sm text-clay">{errors.summary}</span>}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Organizer</span>
            <input className={fieldClass} value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
            {errors.organizer && <span className="mt-1 block text-sm text-clay">{errors.organizer}</span>}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Email</span>
            <input type="email" className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <span className="mt-1 block text-sm text-clay">{errors.email}</span>}
          </label>
        </div>
        <button type="submit" className={`${buttonClass('lime')} mt-2 w-fit`}>
          Submit listing
        </button>
      </form>
    </>
  )
}
