import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonClass } from '../lib/classNames'
import { Aurora } from './bits/Aurora'
import { BlurText } from './bits/BlurText'

const ease = [0.22, 1, 0.36, 1] as const

const frames = [
  { slug: 'danyal-zafar-zoha-waseem', src: '/images/concert-zafar.jpg', alt: 'Danyal Zafar and Zoha Waseem live in Faisalabad', height: 270 },
  { slug: 'the-spotlight-show', src: '/images/spotlight-show.jpg', alt: 'The Spotlight Show at Golden Bowl', height: 250 },
  { slug: 'faisalabad-comedy-night', src: '/images/comedy.jpg', alt: 'Faisalabad Comedy Night', height: 240 },
  { slug: 'lyallpur-maker-room', src: '/images/maker.jpg', alt: 'Lyallpur Maker Room', height: 220 },
  { slug: 'lyallpur-food-culture-festival', src: '/images/market.jpg', alt: 'Lyallpur Food & Culture Festival', height: 230 },
  { slug: 'canal-road-night-out', src: '/images/city-night.jpg', alt: 'Canal Road Night Out', height: 260 },
]

const beats = [
  { day: 2, title: 'Chenab Kitchen Pop-up', place: 'Lyallpur Galleria' },
  { day: 3, title: 'Lyallpur Food & Culture Festival', place: 'D-Ground' },
  { day: 4, title: 'Danyal Zafar & Zoha Waseem', place: 'Faisalabad' },
]

const week = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function octoberCells() {
  const first = new Date(2026, 9, 1).getDay()
  const lead = (first + 6) % 7
  const cells: Array<number | null> = Array.from({ length: lead }, () => null)
  for (let day = 1; day <= 31; day += 1) cells.push(day)
  return cells
}

function useWideScreen() {
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const apply = () => setWide(query.matches)
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])
  return wide
}

export function Hero() {
  const reduce = useReducedMotion()
  const wide = useWideScreen()

  return (
    <section className="px-3 pt-3 md:px-5" aria-label="Introduction">
      <div className="relative overflow-hidden rounded-[28px] bg-hero text-white">
        <Aurora />
        <div className="relative z-10 mx-auto max-w-4xl px-5 pt-14 text-center md:pt-20">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.35, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-white/80"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            FAISALABAD'S EVENT GUIDE
          </motion.p>
          <h1 className="mt-6 text-[2.55rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            <BlurText text="Discover What’s Happening" className="block" />
            <BlurText text="in Faisalabad" className="block" delay={0.12} />
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.35, delay: reduce ? 0 : 0.22, ease }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
          >
            Find events, experiences, workshops, concerts and activities happening around the city — all in one place.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.35, delay: reduce ? 0 : 0.3, ease }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/events" className={buttonClass('lime')}>
              Explore Events
            </Link>
            <Link to="/list" className={buttonClass('ghost')}>
              List Your Event
            </Link>
          </motion.div>
        </div>

        <div className="relative z-10 mt-10 lg:mt-4 lg:min-h-[390px]">
          <Filmstrip />
          {wide ? (
            <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-between px-6 xl:px-12">
              <DateCard />
              <TicketCard />
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto px-4 pb-6">
              <DateCard />
              <TicketCard />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Filmstrip() {
  const reduce = useReducedMotion()
  return (
    <div className="filmstrip px-4 pb-4 lg:px-56 lg:pb-10">
      <div className="filmstrip-row flex items-end justify-start gap-3 overflow-x-auto lg:justify-center lg:overflow-visible">
        {frames.map((frame, index) => (
          <motion.div
            key={frame.slug}
            initial={reduce ? false : { opacity: 0, y: 56 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + index * 0.08, duration: 0.75, ease }}
            className="shrink-0"
          >
            <Link
              to={`/events/${frame.slug}`}
              className="block overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
              style={{ width: 168, height: frame.height }}
            >
              <img src={frame.src} alt={frame.alt} className="h-full w-full object-cover" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DateCard() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const cells = octoberCells()
  const beat = beats[index]

  useEffect(() => {
    if (reduce) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % beats.length)
    }, 2400)
    return () => window.clearInterval(timer)
  }, [reduce])

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: -28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.45, duration: 0.7, ease }}
      className="pointer-events-auto w-[250px] shrink-0 rounded-2xl bg-white p-4 text-ink shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-[0.16em]">OCTOBER</p>
        <p className="text-xs text-muted">2026</p>
      </div>
      <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-medium text-muted">
        {week.map((label, dayIndex) => (
          <span key={`${label}-${dayIndex}`}>{label}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7">
        {cells.map((day, cellIndex) => (
          <div key={cellIndex} className="relative grid h-7 place-items-center text-[11px]">
            {day === beat.day && (
              <motion.span layoutId="hero-day" className="absolute inset-0.5 rounded-full bg-lime" />
            )}
            <span className="relative">{day ?? ''}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 min-h-12 border-t border-line pt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={beat.day}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-sm font-semibold leading-snug">{beat.title}</p>
            <p className="text-xs text-muted">{beat.place}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function TicketCard() {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55, duration: 0.7, ease }}
      className="pointer-events-auto relative w-[250px] shrink-0 rounded-2xl bg-white px-4 py-4 text-ink shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
    >
      <p className="text-[10px] font-semibold tracking-[0.18em] text-muted">ADMIT ONE</p>
      <p className="mt-2 pr-16 font-semibold leading-tight">Danyal Zafar & Zoha Waseem</p>
      <p className="mt-1 text-sm text-muted">Sun 4 Oct · 6:00 PM</p>
      <p className="text-sm text-muted">Faisalabad</p>
      <div className="relative my-3 border-t border-dashed border-line">
        <span className="absolute -left-6 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-hero" />
        <span className="absolute -right-6 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-hero" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.14em] text-muted">EARLY BIRD</p>
          <p className="font-semibold">Rs 3,500</p>
        </div>
        <p className="text-xs text-muted">2 seats</p>
      </div>
      <motion.p
        initial={reduce ? false : { opacity: 0, scale: 1.35, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: -8 }}
        transition={{ delay: 1.15, duration: 0.45, ease }}
        className="absolute right-3 top-3 rounded-md border-2 border-ink px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
      >
        Reserved
      </motion.p>
    </motion.div>
  )
}
