import { Link } from 'react-router-dom'
import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { SITE } from '../data/content'
import { Logo } from './Logo'
import './Footer.css'

const CURRENT_YEAR = new Date().getFullYear()

const COLUMNS = [
  {
    title: 'La Fondation',
    links: [
      { label: 'Notre mission', to: '/#mission' },
      { label: 'Comment ça marche', to: '/#processus' },
      { label: 'Témoignages', to: '/#temoignages' },
      { label: 'Questions fréquentes', to: '/#faq' },
    ],
  },
  {
    title: 'Candidats',
    links: [
      { label: 'Déposer une demande', to: '/demande' },
      { label: 'Critères d’éligibilité', to: '/demande#criteres' },
      { label: 'Suivi de dossier', to: '/#faq' },
    ],
  },
  {
    title: 'Gouvernance',
    links: [
      { label: 'Transparence', to: '/#mission' },
      { label: 'Charte éthique', to: '/#mission' },
      { label: 'Nous contacter', to: '/#contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p className="footer__baseline">{SITE.baseline}</p>
          <ul className="footer__contact">
            <li>
              <Mail size={16} />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <MessageCircle size={16} />
              <a href={SITE.whatsappPublicLink} target="_blank" rel="noreferrer">
                {SITE.whatsappPublic}
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__columns">
          {COLUMNS.map((column) => (
            <div className="footer__column" key={column.title}>
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container footer__offices">
        <div className="footer__office">
          <MapPin size={16} />
          <div>
            <strong>Paris</strong>
            <span>18 avenue de l’Innovation, 75008</span>
          </div>
        </div>
        <div className="footer__office">
          <MapPin size={16} />
          <div>
            <strong>San Francisco</strong>
            <span>1 Mission Innovation Way, CA 94105</span>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© {CURRENT_YEAR} {SITE.name}. Une passerelle philanthropique France ↔ États-Unis.</p>
        <p className="footer__legal">
          Les demandes sont étudiées gratuitement et sans frais de dossier.
        </p>
      </div>
    </footer>
  )
}
