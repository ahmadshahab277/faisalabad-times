import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useCity } from '../context/CityContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { buttonClass } from '../lib/classNames'
import { formatPrice } from '../lib/format'

export function BookingsPage() {
  usePageTitle('My Bookings')
  const { bookings, cancelBooking } = useCity()
  const [pending, setPending] = useState<string | null>(null)

  return (
    <>
      <PageHeader
        eyebrow="MY BOOKINGS"
        title="Seats held on this device"
        lede="Reservations you confirm in the demo live here until you remove them. They are not sent to a venue."
      />
      <div className="mx-auto max-w-[1240px] px-4 pb-16 md:px-6">
        {bookings.length === 0 ? (
          <div className="max-w-md rounded-3xl border border-line bg-white p-6">
            <p className="font-semibold">No reservations yet.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Pick a sample listing and hold a seat. It will show up on this page.
            </p>
            <Link to="/events" className={`${buttonClass('ink')} mt-5`}>
              Explore Events
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {bookings.map((booking) => (
              <li key={booking.id} className="rounded-3xl border border-line bg-white p-5">
                <div className="flex gap-4">
                  <img src={booking.eventImage} alt="" className="h-20 w-24 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-muted">{booking.reference}</p>
                    <h2 className="mt-1 font-semibold tracking-tight">
                      <Link to={`/events/${booking.eventSlug}`} className="hover:underline">
                        {booking.eventTitle}
                      </Link>
                    </h2>
                    <p className="text-sm text-muted">
                      {booking.dateLabel} · {booking.time}
                    </p>
                    <p className="text-sm text-muted">
                      {booking.venueName} · {booking.areaLabel}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm">
                  {booking.tierName} · {booking.quantity} {booking.quantity === 1 ? 'seat' : 'seats'} · {formatPrice(booking.total)}
                </p>
                <p className="text-sm text-muted">{booking.name}</p>
                {pending === booking.id ? (
                  <div className="mt-4 flex gap-2">
                    <button type="button" className={buttonClass('ink')} onClick={() => cancelBooking(booking.id)}>
                      Confirm cancel
                    </button>
                    <button type="button" className={buttonClass('line')} onClick={() => setPending(null)}>
                      Keep it
                    </button>
                  </div>
                ) : (
                  <button type="button" className={`${buttonClass('line')} mt-4`} onClick={() => setPending(booking.id)}>
                    Cancel reservation
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
