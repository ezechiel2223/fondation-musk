import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { NAV_ITEMS } from '../data/content'
import { Logo } from './Logo'
import './Navbar.css'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Empêche le scroll d'arrière-plan quand le menu est ouvert.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function closeMenu() {
    setOpen(false)
  }

  return (
    <header className={`navbar${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="navbar__inner container">
        <Logo />

        <nav className="navbar__links" aria-label="Navigation principale">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className="navbar__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="navbar__actions">
          <Link to="/demande" className="btn btn--primary btn--sm">
            Demander un financement
            <ArrowRight size={16} />
          </Link>
        </div>

        <button
          type="button"
          className="navbar__burger"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="navbar__mobile" role="dialog" aria-modal={open} aria-hidden={!open}>
        <nav className="navbar__mobile-links" aria-label="Navigation mobile">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="navbar__mobile-link"
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link to="/demande" className="btn btn--primary btn--block" onClick={closeMenu}>
          Demander un financement
          <ArrowRight size={18} />
        </Link>
      </div>
    </header>
  )
}
