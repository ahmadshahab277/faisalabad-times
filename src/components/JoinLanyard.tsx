import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Lanyard from './Lanyard'

const ink = '#141414'
const paper = '#f3f1ea'
const lime = '#d6f34a'
const muted = '#6e685f'
const font = '"Plus Jakarta Sans", sans-serif'

function canvasBlob(draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void, width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.resolve('')
  draw(ctx, width, height)
  return new Promise<string>((resolve) => {
    canvas.toBlob((file) => resolve(file ? URL.createObjectURL(file) : ''), 'image/png')
  })
}

function paintFront(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = ink
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = lime
  ctx.fillRect(78, 210, 88, 10)
  ctx.fillStyle = paper
  ctx.font = `600 26px ${font}`
  ctx.fillText('THE CITY’S PASS', 78, 280)
  ctx.font = `800 96px ${font}`
  ctx.fillText('Faisalabad', 78, 430)
  ctx.fillStyle = lime
  ctx.fillText('Times', 78, 540)
  ctx.fillStyle = paper
  ctx.font = `600 46px ${font}`
  const lines = ['Join us and be', 'the part of', 'our event']
  lines.forEach((line, index) => ctx.fillText(line, 78, 980 + index * 68))
  ctx.fillStyle = muted
  ctx.font = `500 22px ${font}`
  ctx.fillText('FAISALABAD', 78, height - 120)
}

function paintBack(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = paper
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = lime
  ctx.fillRect(78, 210, 88, 10)
  ctx.fillStyle = ink
  ctx.font = `800 84px ${font}`
  ctx.fillText('Faisalabad', 78, 400)
  ctx.fillText('Times', 78, 500)
  ctx.font = `600 42px ${font}`
  const lines = ['Join us and be', 'the part of', 'our event']
  lines.forEach((line, index) => ctx.fillText(line, 78, 860 + index * 64))
}

function paintBand(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = ink
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = lime
  ctx.font = `700 54px ${font}`
  ctx.textBaseline = 'middle'
  const label = 'FAISALABAD TIMES'
  const gap = 56
  let x = 36
  while (x < width) {
    ctx.fillStyle = lime
    ctx.fillRect(x, height / 2 - 6, 12, 12)
    x += 28
    ctx.fillStyle = paper
    ctx.fillText(label, x, height / 2)
    x += ctx.measureText(label).width + gap
  }
}

export function JoinLanyard() {
  const rootRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [reduce, setReduce] = useState(false)
  const [faces, setFaces] = useState<{ front: string; back: string; band: string } | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduce(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '240px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false
    const urls: string[] = []
    document.fonts.ready.then(async () => {
      const [front, back, band] = await Promise.all([
        canvasBlob(paintFront, 900, 1350),
        canvasBlob(paintBack, 900, 1350),
        canvasBlob(paintBand, 1800, 220),
      ])
      if (cancelled) {
        ;[front, back, band].forEach((url) => URL.revokeObjectURL(url))
        return
      }
      urls.push(front, back, band)
      setFaces({ front, back, band })
    })
    return () => {
      cancelled = true
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  return (
    <section ref={rootRef} className="bg-paper" aria-labelledby="join-heading">
      <div className="mx-auto max-w-[760px] px-4 pt-16 text-center md:px-6 md:pt-24">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted">FAISALABAD TIMES</p>
        <h2 id="join-heading" className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
          Join us and be the part of our event
        </h2>
        <Link
          to="/events"
          className="mt-6 inline-flex text-sm font-semibold underline decoration-lime decoration-2 underline-offset-4"
        >
          Explore events
        </Link>
      </div>
      {reduce || !inView || !faces ? (
        <div className="flex justify-center px-4 py-10">
          {faces ? (
            <img src={faces.front} alt="Faisalabad Times. Join us and be the part of our event." className="w-[220px] rounded-2xl shadow-[0_24px_50px_rgba(20,20,20,0.16)]" />
          ) : (
            <div className="h-[320px] w-[220px] rounded-2xl bg-ink" aria-hidden="true" />
          )}
        </div>
      ) : (
        <Lanyard
          position={[0, 0, 24]}
          gravity={[0, -40, 0]}
          frontImage={faces.front}
          backImage={faces.back}
          imageFit="cover"
          lanyardImage={faces.band}
          lanyardWidth={1}
        />
      )}
    </section>
  )
}
