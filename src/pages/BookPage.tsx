import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import SlideCommit from '../components/SlideCommit'
import TargetCursor from '../components/TargetCursor'
import { useCity } from '../context/CityContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { isSoldOut, seatsLeft } from '../lib/booking'
import { buttonClass, cx, fieldClass } from '../lib/classNames'
import { formatEventDate, formatPrice, formatTime } from '../lib/format'
import type { Booking } from '../types'
import { NotFoundPage } from './NotFoundPage'

const ease = [0.22, 1, 0.36, 1] as const
const steps = ['Select Tickets', 'Customer Details', 'Payment', 'Confirmation'] as const
const WHATSAPP = '923136625199'

function ticketWhatsAppUrl(booking: Booking) {
  const text = [
    'Faisalabad Times — ticket',
    `Reference: ${booking.reference}`,
    `Event: ${booking.eventTitle}`,
    `When: ${booking.dateLabel} · ${booking.time}`,
    `Where: ${booking.venueName}, ${booking.areaLabel}`,
    `Ticket: ${booking.tierName} × ${booking.quantity}`,
    `Total: ${formatPrice(booking.total)}`,
    `Name: ${booking.name}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone}`,
    `Payment: ${booking.paymentNote ?? 'Pay at the venue'}`,
  ].join('\n')
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
}

export function BookPage() {
  const { slug } = useParams()
  const { events, venues, bookings, reserve } = useCity()
  const event = events.find((item) => item.slug === slug)
  const venue = venues.find((item) => item.id === event?.venueId)
  usePageTitle(event ? `Reserve · ${event.title}` : 'Reserve')
  const reduce = useReducedMotion()

  const openTiers = useMemo(() => {
    if (!event) return []
    return event.tickets.filter((tier) => seatsLeft(tier, bookings, event.id) > 0)
  }, [bookings, event])

  const [step, setStep] = useState(0)
  const [tierId, setTierId] = useState(openTiers[0]?.id ?? '')
  const [quantity, setQuantity] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [payAtVenue, setPayAtVenue] = useState(true)
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState<Booking | null>(null)

  if (!event || !venue) return <NotFoundPage />

  const soldOut = isSoldOut(event, bookings)
  const tier = event.tickets.find((item) => item.id === tierId) ?? openTiers[0]
  const left = tier ? seatsLeft(tier, bookings, event.id) : 0
  const total = tier ? tier.price * quantity : 0

  function continueFromTickets() {
    const next: Record<string, string> = {}
    if (!tier || quantity < 1 || quantity > left) next.quantity = 'That many seats are not open.'
    setErrors(next)
    if (Object.keys(next).length === 0) setStep(1)
  }

  function continueFromDetails() {
    const next: Record<string, string> = {}
    if (name.trim().length < 2) next.name = 'Add the name for the reservation.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email.'
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 13) next.phone = 'Enter a phone number we can read back.'
    setErrors(next)
    if (Object.keys(next).length === 0) setStep(2)
  }

  function confirmPayment() {
    if (!event || !venue || !tier) return
    const next: Record<string, string> = {}
    let paymentNote = 'Pay at the venue'
    if (!payAtVenue) {
      const digits = card.replace(/\D/g, '')
      if (digits.length !== 16) next.card = 'Enter a 16-digit demo card number.'
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) next.expiry = 'Use MM/YY.'
      if (!/^\d{3}$/.test(cvc)) next.cvc = 'Enter a 3-digit CVC.'
      paymentNote = digits.length === 16 ? `Card ending ${digits.slice(-4)}` : ''
    }
    setErrors(next)
    if (Object.keys(next).length > 0 || !paymentNote) throw new Error('Check the details')

    const booking: Booking = {
      id: crypto.randomUUID(),
      reference: `FT-${Math.floor(1000 + Math.random() * 9000)}`,
      eventId: event.id,
      eventSlug: event.slug,
      eventTitle: event.title,
      eventImage: event.image,
      dateLabel: formatEventDate(event.startDate, event.endDate),
      time: formatTime(event.time),
      venueName: venue.name,
      areaLabel: venue.areaLabel,
      tierId: tier.id,
      tierName: tier.name,
      unitPrice: tier.price,
      quantity,
      total,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      paymentNote,
      createdAt: new Date().toISOString(),
    }
    setCard('')
    setCvc('')
    reserve(booking)
    setDone(booking)
    window.open(ticketWhatsAppUrl(booking), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mx-auto grid max-w-[1100px] gap-10 px-4 py-10 md:px-6 md:py-14 lg:grid-cols-[280px_minmax(0,1fr)]">
      {!reduce && <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn />}
      <aside>
        <Link to={`/events/${event.slug}`} className="text-sm text-muted hover:text-ink">
          Back to listing
        </Link>
        <img src={event.image} alt="" className="mt-4 aspect-[4/3] w-full rounded-2xl object-cover" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{event.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {formatEventDate(event.startDate, event.endDate)} · {formatTime(event.time)}
        </p>
        <p className="text-sm text-muted">
          {venue.name} · {venue.areaLabel}
        </p>
      </aside>

      <section aria-labelledby="reserve-heading">
        <h2 id="reserve-heading" className="sr-only">
          {steps[step]}
        </h2>
        {soldOut || !tier ? (
          <p className="rounded-2xl border border-line bg-white p-5 text-sm">This listing is sold out.</p>
        ) : (
          <>
            <ol className="grid grid-cols-4 gap-2" aria-label="Booking progress">
              {steps.map((label, index) => (
                <li key={label}>
                  <div className="h-1 overflow-hidden rounded-full bg-line">
                    <motion.div
                      className="h-full bg-ink"
                      initial={false}
                      animate={{ width: step >= index ? '100%' : '0%' }}
                      transition={{ duration: reduce ? 0.12 : 0.28, ease }}
                    />
                  </div>
                  <p className={cx('mt-2 text-[11px] sm:text-xs', step === index ? 'font-semibold' : 'text-muted')}>
                    {label}
                  </p>
                </li>
              ))}
            </ol>

            <div className="relative mt-8 max-w-xl">
              <AnimatePresence mode="wait" initial={false}>
                {step === 0 && (
                  <motion.div
                    key="tickets"
                    initial={{ opacity: 0, x: reduce ? 0 : 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0.12 : 0.26, ease }}
                  >
                      <h3 className="text-3xl font-semibold tracking-tight">Select Tickets</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">Choose a ticket and how many seats to hold.</p>
                      <fieldset className="mt-6">
                        <legend className="sr-only">Ticket</legend>
                        <div className="space-y-2">
                          {event.tickets.map((item) => {
                            const remaining = seatsLeft(item, bookings, event.id)
                            const disabled = remaining === 0
                            return (
                              <label
                                key={item.id}
                                className={cx(
                                  'flex cursor-pointer items-start justify-between gap-3 rounded-2xl border px-4 py-3',
                                  !disabled && 'cursor-target',
                                  tier.id === item.id ? 'border-ink bg-white' : 'border-line bg-white',
                                  disabled && 'cursor-not-allowed opacity-50',
                                )}
                              >
                                <span className="flex gap-3">
                                  <input
                                    type="radio"
                                    name="tier"
                                    className="mt-1"
                                    checked={tier.id === item.id}
                                    disabled={disabled}
                                    onChange={() => {
                                      setTierId(item.id)
                                      setQuantity(1)
                                    }}
                                  />
                                  <span>
                                    <span className="block text-sm font-semibold">{item.name}</span>
                                    <span className="block text-sm text-muted">{item.detail}</span>
                                    <span className="block text-xs text-muted">{disabled ? 'Sold out' : `${remaining} open`}</span>
                                  </span>
                                </span>
                                <span className="text-sm font-semibold">{formatPrice(item.price)}</span>
                              </label>
                            )
                          })}
                        </div>
                      </fieldset>
                      <div className="mt-6">
                        <p className="text-sm font-semibold">Seats</p>
                        <div className="cursor-target mt-3 inline-flex items-center gap-3 rounded-full border border-line bg-white px-2 py-1">
                          <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper"
                            aria-label="Fewer seats"
                            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                          <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper"
                            aria-label="More seats"
                            onClick={() => setQuantity((value) => Math.min(left, value + 1))}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        {errors.quantity && <p className="mt-2 text-sm text-clay">{errors.quantity}</p>}
                      </div>
                      <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
                        <Total total={total} />
                        <button type="button" className={`${buttonClass('lime')} cursor-target`} onClick={continueFromTickets}>
                          Continue
                        </button>
                      </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: reduce ? 0 : 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0.12 : 0.26, ease }}
                  >
                      <h3 className="text-3xl font-semibold tracking-tight">Customer Details</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">These stay on this device with the reservation.</p>
                      <div className="mt-6 grid gap-4">
                        <Field label="Full name" error={errors.name}>
                          <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                        </Field>
                        <Field label="Email" error={errors.email}>
                          <input className={fieldClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                        </Field>
                        <Field label="Phone" error={errors.phone}>
                          <input className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="03xx xxx xxxx" />
                        </Field>
                      </div>
                      <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
                        <button type="button" className={`${buttonClass('line')} cursor-target`} onClick={() => setStep(0)}>
                          Back
                        </button>
                        <button type="button" className={`${buttonClass('lime')} cursor-target`} onClick={continueFromDetails}>
                          Continue
                        </button>
                      </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: reduce ? 0 : 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0.12 : 0.26, ease }}
                  >
                      <h3 className="text-3xl font-semibold tracking-tight">Payment</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        Demo only. No charge is made, and a card number is not saved.
                      </p>
                      <div className="mt-6 space-y-2">
                        <label className={cx('cursor-target flex cursor-pointer gap-3 rounded-2xl border bg-white px-4 py-3', payAtVenue ? 'border-ink' : 'border-line')}>
                          <input type="radio" name="pay" checked={payAtVenue} onChange={() => setPayAtVenue(true)} />
                          <span>
                            <span className="block text-sm font-semibold">Pay at the venue</span>
                            <span className="block text-sm text-muted">Hold the seats and settle there.</span>
                          </span>
                        </label>
                        <label className={cx('cursor-target flex cursor-pointer gap-3 rounded-2xl border bg-white px-4 py-3', !payAtVenue ? 'border-ink' : 'border-line')}>
                          <input type="radio" name="pay" checked={!payAtVenue} onChange={() => setPayAtVenue(false)} />
                          <span>
                            <span className="block text-sm font-semibold">Demo card</span>
                            <span className="block text-sm text-muted">Checked, then discarded except the last four digits.</span>
                          </span>
                        </label>
                      </div>
                      {!payAtVenue && (
                        <div className="mt-4 grid gap-4">
                          <Field label="Card number" error={errors.card}>
                            <input
                              className={fieldClass}
                              inputMode="numeric"
                              autoComplete="off"
                              placeholder="4242 4242 4242 4242"
                              value={card}
                              onChange={(e) => setCard(e.target.value)}
                            />
                          </Field>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Expiry" error={errors.expiry}>
                              <input className={fieldClass} placeholder="MM/YY" autoComplete="off" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                            </Field>
                            <Field label="CVC" error={errors.cvc}>
                              <input className={fieldClass} inputMode="numeric" autoComplete="off" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
                            </Field>
                          </div>
                        </div>
                      )}
                      <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
                        <div>
                          <button type="button" className={`${buttonClass('line')} cursor-target`} onClick={() => setStep(1)}>
                            Back
                          </button>
                          <p className="mt-3 text-2xl font-semibold tracking-tight">{formatPrice(total)}</p>
                        </div>
                        <div className="text-right">
                          <SlideCommit
                            label="Slide to book ticket"
                            doneLabel="Booked"
                            errorLabel="Check the details"
                            onConfirm={confirmPayment}
                            onDone={() => setStep(3)}
                            trackColor="#141414"
                            handleColor="#d6f34a"
                            successColor="#d6f34a"
                            dangerColor="#8d4b32"
                            width={280}
                            height={56}
                            radius={28}
                            speed={50}
                            returnBounce={0.38}
                            landingDip={0.026}
                            holdMs={1500}
                            className="cursor-target"
                          />
                          <p className="mt-2 text-xs text-muted">Details go to WhatsApp 03136625199.</p>
                        </div>
                      </div>
                  </motion.div>
                )}

                {step === 3 && done && (
                  <motion.div
                    key="confirmed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0.12 : 0.26, ease }}
                  >
                    <Confirmation booking={done} reduce={Boolean(reduce)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function Total({ total }: { total: number }) {
  return (
    <div>
      <p className="text-xs text-muted">Total</p>
      <p className="text-2xl font-semibold tracking-tight">{formatPrice(total)}</p>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-sm text-clay">{error}</span>}
    </label>
  )
}

function Confirmation({ booking, reduce }: { booking: Booking; reduce: boolean }) {
  return (
    <div>
      <ConfirmMark reduce={reduce} />
      <h3 className="text-3xl font-semibold tracking-tight">Booking Confirmed</h3>
      <p className="mt-2 text-sm text-muted">Show this reference if a real box office is connected later.</p>
      <motion.div
        className="cursor-target relative mt-8 max-w-md overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-[0_24px_60px_rgba(20,20,20,0.18)]"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0.15 : 0.4, delay: reduce ? 0 : 0.35, ease }}
      >
        <p className="text-[11px] font-semibold tracking-[0.18em] text-white/60">FAISALABAD TIMES</p>
        <p className="mt-4 text-2xl font-semibold tracking-tight">{booking.eventTitle}</p>
        <p className="mt-2 text-sm text-white/70">
          {booking.dateLabel} · {booking.time}
        </p>
        <p className="text-sm text-white/70">
          {booking.venueName} · {booking.areaLabel}
        </p>
        <div className="my-5 border-t border-dashed border-white/20" />
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.14em] text-white/50">{booking.tierName.toUpperCase()}</p>
            <p className="mt-1 font-semibold">
              {booking.quantity} {booking.quantity === 1 ? 'seat' : 'seats'} · {formatPrice(booking.total)}
            </p>
            <p className="mt-1 text-sm text-white/70">{booking.name}</p>
            {booking.paymentNote && <p className="mt-1 text-sm text-white/50">{booking.paymentNote}</p>}
          </div>
          <p className="text-right text-lg font-semibold tracking-tight">{booking.reference}</p>
        </div>
      </motion.div>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={ticketWhatsAppUrl(booking)} target="_blank" rel="noreferrer" className={`${buttonClass('lime')} cursor-target`}>
          Send details on WhatsApp
        </a>
        <Link to="/bookings" className={`${buttonClass('ink')} cursor-target`}>
          View in My Bookings
        </Link>
      </div>
    </div>
  )
}

function ConfirmMark({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative mb-5 h-14 w-14" aria-hidden="true">
      <svg viewBox="0 0 52 52" className="h-14 w-14">
        <motion.circle
          cx="26"
          cy="26"
          r="23"
          fill="none"
          stroke="#d6f34a"
          strokeWidth="2"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0.1 : 0.4, ease }}
        />
        <motion.path
          d="M16 27 l7 7 14-14"
          fill="none"
          stroke="#141414"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0.1 : 0.28, delay: reduce ? 0 : 0.22, ease }}
        />
      </svg>
      {!reduce &&
        Array.from({ length: 8 }, (_, index) => (
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-lime"
            initial={{ opacity: 0.9, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              x: Math.cos((index / 8) * Math.PI * 2) * 28,
              y: Math.sin((index / 8) * Math.PI * 2) * 28,
            }}
            transition={{ duration: 0.7, ease }}
          />
        ))}
    </div>
  )
}
