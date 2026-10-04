import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { ScrollToTop } from '../components/ScrollToTop'

/** Enveloppe commune à toutes les pages publiques. */
export function SiteLayout() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
