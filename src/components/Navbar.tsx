import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, Search, Ticket, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCity } from '../context/CityContext'
import { buttonClass, cx } from '../lib/classNames'
import { formatEventDate, formatTime } from '../lib/format'
import { getVenue } from '../services/catalog'
import { Logo } from './Logo'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/events', label: 'Events', end: false },
  { to: '/venues', label: 'Venues', end: false },
  { to: '/categories', label: 'Categories', end: false },
  { to: '/about', label: 'About', end: false },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const { bookings } = useCity()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname, location.search])

  return (
    <header
      className={cx(
        'sticky top-0 z-40 border-b transition-[background-color,box-shadow,border-color] duration-300',
        scrolled || menuOpen || searchOpen
          ? 'border-line bg-paper/95 shadow-[0_8px_24px_rgba(20,20,20,0.06)] backdrop-blur-md'
          : 'border-transparent bg-paper/70',
      )}
    >
      <motion.div
        className="mx-auto flex max-w-[1240px] items-center gap-4 px-4 md:px-6"
        animate={{ height: scrolled ? 56 : 68 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Logo />
        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cx(
                  'rounded-full px-3 py-1.5 text-sm transition-colors',
                  isActive ? 'bg-white font-semibold text-ink' : 'text-muted hover:text-ink',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink"
            aria-label="Search events"
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((open) => !open)
              setMenuOpen(false)
            }}
          >
            <Search size={18} />
          </button>
          <Link
            to="/bookings"
            className="inline-flex h-10 items-center gap-2 rounded-full px-2.5 text-sm font-medium text-ink sm:px-3"
          >
            <Ticket size={18} />
            <span className="hidden sm:inline">My Bookings</span>
            {bookings.length > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-lime px-1 text-[11px] font-semibold text-ink">
                {bookings.length}
              </span>
            )}
          </Link>
          <Link to="/list" className={cx(buttonClass('ink'), 'hidden h-10 px-4 md:inline-flex')}>
            List Your Event
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((open) => !open)
              setSearchOpen(false)
            }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu />
        )}
      </AnimatePresence>
    </header>
  )
}

function MobileMenu() {
  const reduce = useReducedMotion()
  return (
    <motion.nav
      aria-label="Mobile"
      initial={reduce ? false : { height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={reduce ? undefined : { height: 0, opacity: 0 }}
      className="overflow-hidden border-t border-line lg:hidden"
    >
      <div className="mx-auto flex max-w-[1240px] flex-col gap-1 px-4 py-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cx('rounded-xl px-3 py-3 text-base', isActive ? 'bg-white font-semibold' : 'text-ink')
            }
          >
            {link.label}
          </NavLink>
        ))}
        <Link to="/list" className={cx(buttonClass('ink'), 'mt-2 h-11')}>
          List Your Event
        </Link>
      </div>
    </motion.nav>
  )
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const { events, venues } = useCity()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const needle = query.trim().toLowerCase()
  const results = events
    .filter((event) => {
      if (!needle) return true
      const venue = venues.find((item) => item.id === event.venueId)
      return [event.title, event.summary, venue?.areaLabel].join(' ').toLowerCase().includes(needle)
    })
    .slice(0, 6)

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -6 }}
      className="border-t border-line bg-paper"
    >
      <form
        className="mx-auto max-w-[1240px] px-4 py-4 md:px-6"
        onSubmit={(event) => {
          event.preventDefault()
          navigate(query.trim() ? `/events?q=${encodeURIComponent(query.trim())}` : '/events')
          onClose()
        }}
      >
        <label className="sr-only" htmlFor="nav-search">
          Search events in Faisalabad
        </label>
        <input
          id="nav-search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search events in Faisalabad..."
          className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-base outline-none focus:border-ink"
        />
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {results.length === 0 && (
            <li className="px-4 py-4 text-sm text-muted">Nothing matches that in the sample calendar.</li>
          )}
          {results.map((event) => {
            const venue = getVenue(event.venueId)
            return (
              <li key={event.id}>
                <Link to={`/events/${event.slug}`} className="flex items-center gap-3 px-3 py-2.5 hover:bg-paper">
                  <img src={event.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{event.title}</span>
                    <span className="block truncate text-xs text-muted">
                      {formatEventDate(event.startDate, event.endDate)} · {formatTime(event.time)} · {venue?.areaLabel}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </form>
    </motion.div>
  )
}
