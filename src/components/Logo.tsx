import { Link } from 'react-router-dom'
import { cx } from '../lib/classNames'

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cx('inline-flex items-center gap-2.5 text-ink', className)}>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M10 1.5h4v2h-4zM9 3.5h6v1.6H9z" />
        <rect x="7" y="5.2" width="10" height="12.2" rx="1" fill="currentColor" />
        <rect x="5" y="17.6" width="14" height="3.2" rx="0.7" fill="currentColor" />
        <circle cx="12" cy="11" r="2.1" fill="#f3f1ea" />
        <path d="M12 11.1 V9.2" stroke="#141414" strokeWidth="0.8" />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">Faisalabad Times</span>
    </Link>
  )
}
