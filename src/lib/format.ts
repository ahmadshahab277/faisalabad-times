const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function parseDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toIso(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatTime(hhmm: string) {
  const [hourPart, minutePart] = hhmm.split(':')
  const hour = Number(hourPart)
  const minute = minutePart ?? '00'
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const twelve = hour % 12 || 12
  return `${twelve}:${minute} ${suffix}`
}

export function formatEventDate(start: string, end: string) {
  const startDate = parseDate(start)
  const endDate = parseDate(end)
  if (start === end) {
    return `${WEEKDAYS[startDate.getDay()]} ${startDate.getDate()} ${MONTHS[startDate.getMonth()]}`
  }
  const sameMonth = startDate.getMonth() === endDate.getMonth()
  const left = sameMonth
    ? String(startDate.getDate())
    : `${startDate.getDate()} ${MONTHS[startDate.getMonth()]}`
  return `${left}–${endDate.getDate()} ${MONTHS[endDate.getMonth()]}`
}

export function formatPrice(amount: number) {
  if (amount === 0) return 'Free'
  return `Rs ${amount.toLocaleString('en-PK')}`
}

export function formatFromPrice(amount: number) {
  if (amount === 0) return 'Free'
  return `From Rs ${amount.toLocaleString('en-PK')}`
}

export function weekdayName(iso: string) {
  return WEEKDAYS[parseDate(iso).getDay()]
}

export function monthName(iso: string) {
  return MONTHS[parseDate(iso).getMonth()]
}

export function dayNumber(iso: string) {
  return parseDate(iso).getDate()
}

export function slugify(value: string) {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return base || 'event'
}
