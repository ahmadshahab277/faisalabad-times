import CircularCarousel from './CircularCarousel'
import { brands, type Brand } from '../data/brands'

function xml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function brandSrc(brand: Brand) {
  const lines = brand.mark.split('\n')
  const longest = Math.max(...lines.map((line) => line.length))
  const size = longest > 14 ? 40 : longest > 9 ? 52 : 68
  const lineHeight = Math.round(size * 1.15)
  const y = 320 - ((lines.length - 1) * lineHeight) / 2
  const tspans = lines
    .map((line, index) => `<tspan x="320" dy="${index === 0 ? 0 : lineHeight}">${xml(line)}</tspan>`)
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><rect width="640" height="640" rx="0" fill="${brand.plate}"/><text x="320" y="${y}" text-anchor="middle" fill="${brand.ink}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="700">${tspans}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const items = brands.map((brand) => ({
  src: brandSrc(brand),
  alt: `${brand.name}, ${brand.category}`,
  title: brand.name,
  subtitle: brand.category,
}))

export function BrandSlider() {
  return (
    <section className="mt-20 bg-hero text-white" aria-labelledby="brands-heading">
      <div className="mx-auto max-w-[1240px] px-4 pt-14 md:px-6 md:pt-20">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          BRANDS
        </p>
        <h2 id="brands-heading" className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
          In good <span className="text-lime">company.</span>
        </h2>
        <p className="mt-3 max-w-xl text-white/60">Companies we have worked with. Drag the ring, or let it turn.</p>
      </div>
      <div className="relative h-[640px]">
        <CircularCarousel
          items={items}
          preset="orbit"
          intro="rise"
          cardWidth={200}
          aspectRatio={1}
          speed={14}
          captions
          fadeColor="#0e0e0e"
        />
      </div>
    </section>
  )
}
