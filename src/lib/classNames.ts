export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function buttonClass(variant: 'lime' | 'ink' | 'ghost' | 'line' = 'ink') {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  const variants = {
    lime: 'bg-lime text-ink hover:bg-[#e4fb7c] focus-visible:outline-ink',
    ink: 'bg-ink text-white hover:bg-black focus-visible:outline-ink',
    ghost: 'border border-white/25 bg-transparent text-white hover:bg-white/10 focus-visible:outline-lime',
    line: 'border border-line bg-white text-ink hover:border-ink focus-visible:outline-ink',
  }
  return `${base} ${variants[variant]}`
}

export const fieldClass =
  'h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/80 focus:border-ink'
