import { useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <AnimatedOutlet />
      </main>
      <Footer />
    </div>
  )
}

function AnimatedOutlet() {
  const location = useLocation()
  const outlet = useOutlet()

  return (
    <div key={location.pathname} className="page-shift">
      {outlet}
    </div>
  )
}
