import { Link } from 'react-router-dom'
import { buttonClass } from '../lib/classNames'
import { usePageTitle } from '../hooks/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Not found')
  return (
    <div className="mx-auto max-w-xl px-4 py-24 md:px-6">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">That page isn’t on the calendar.</h1>
      <p className="mt-3 text-muted">The listing may have moved, or the address is off.</p>
      <Link to="/events" className={`${buttonClass('ink')} mt-6`}>
        Browse events
      </Link>
    </div>
  )
}
