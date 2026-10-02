import { Link } from 'react-router-dom'
import { Logo } from './Logo'

const explore = [
  { to: '/events', label: 'Events' },
  { to: '/venues', label: 'Venues' },
  { to: '/categories', label: 'Categories' },
  { to: '/bookings', label: 'My Bookings' },
  { to: '/list', label: 'List Your Event' },
  { to: '/about', label: 'About' },
]

const places = ['D-Ground', 'Canal Road', 'Clock Tower', 'Kohinoor City', 'Lyallpur Galleria', 'Chen One Road']

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">What’s Happening in Faisalabad.</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">EXPLORE</p>
          <ul className="mt-3 space-y-2">
            {explore.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">IN THE CITY</p>
          <ul className="mt-3 space-y-2">
            {places.map((place) => (
              <li key={place} className="text-sm">
                {place}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[1240px] px-4 py-4 text-xs text-muted md:px-6">
          Sample listings for this demo. Reservations stay in your browser and no payment is taken.
        </p>
      </div>
    </footer>
  )
}
