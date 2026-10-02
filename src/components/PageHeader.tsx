export function PageHeader({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <header className="mx-auto max-w-[1240px] px-4 pb-8 pt-10 md:px-6 md:pt-14">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{lede}</p>
    </header>
  )
}
