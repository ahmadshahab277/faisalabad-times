import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CityProvider } from './context/CityContext'
import { AboutPage } from './pages/AboutPage'
import { BookPage } from './pages/BookPage'
import { BookingsPage } from './pages/BookingsPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { EventsPage } from './pages/EventsPage'
import { HomePage } from './pages/HomePage'
import { ListEventPage } from './pages/ListEventPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { VenueDetailPage } from './pages/VenueDetailPage'
import { VenuesPage } from './pages/VenuesPage'

export default function App() {
  return (
    <BrowserRouter>
      <CityProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:slug" element={<EventDetailPage />} />
            <Route path="events/:slug/book" element={<BookPage />} />
            <Route path="venues" element={<VenuesPage />} />
            <Route path="venues/:slug" element={<VenueDetailPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="list" element={<ListEventPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </CityProvider>
    </BrowserRouter>
  )
}
