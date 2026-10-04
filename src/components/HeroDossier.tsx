import { useEffect, useState } from 'react'
import { BadgeCheck, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { fetchFeaturedApplication, isSupabaseConfigured } from '../lib/supabase'
import {
  formatCurrency,
  maskName,
  maskWhatsapp,
  progressStage,
} from '../lib/format'
import type { Application } from '../types'

/** Exemple affiché tant qu'aucun dossier n'a encore été accepté. */
const DEMO = {
  full_name: 'Camille Deschamps',
  project_title: 'SolarLeaf — énergie solaire',
  amount_requested: 85000,
  currency: 'USD',
  whatsapp: '33612345678',
  progress: 72,
}

/**
 * Carte « Dossier de financement » du hero.
 *
 * Elle affiche automatiquement le dernier dossier ACCEPTÉ depuis l'espace
 * admin (« en étude »). Le pourcentage est celui réglé par l'administrateur.
 * Les données personnelles sont anonymisées (prénom + initiale, numéro masqué).
 */
export function HeroDossier() {
  const [featured, setFeatured] = useState<Application | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true

    function load() {
      fetchFeaturedApplication()
        .then((application) => {
          if (active) setFeatured(application)
        })
        .catch(() => {
          /* silencieux : on garde l'exemple de démonstration */
        })
    }

    load()

    // Se met à jour dès que l'on revient sur l'onglet : la carte suit ainsi
    // immédiatement les réglages faits dans l'espace administrateur.
    window.addEventListener('focus', load)
    document.addEventListener('visibilitychange', load)

    return () => {
      active = false
      window.removeEventListener('focus', load)
      document.removeEventListener('visibilitychange', load)
    }
  }, [])

  const name = featured ? maskName(featured.full_name) : DEMO.full_name
  const project = featured ? featured.project_title : DEMO.project_title
  const amount = featured ? featured.amount_requested : DEMO.amount_requested
  const currency = featured ? featured.currency : DEMO.currency
  const whatsapp = featured ? maskWhatsapp(featured.whatsapp) : '+33 •• •• •• ••'
  const progress = featured ? featured.progress : DEMO.progress

  return (
    <div className="hero-card">
      <div className="hero-card__head">
        <span className="hero-card__title">
          <ShieldCheck size={18} /> Dossier de financement
        </span>
        <span className="badge badge--pending">En étude</span>
      </div>

      <div className="hero-card__field">
        <span>Porteur du projet</span>
        <strong>{name}</strong>
      </div>
      <div className="hero-card__field">
        <span>Projet</span>
        <strong>{project}</strong>
      </div>

      <div className="hero-card__amount">
        <span>Montant demandé</span>
        <strong>{formatCurrency(amount, currency)}</strong>
      </div>

      <div className="hero-card__whatsapp">
        <MessageCircle size={18} />
        <div>
          <span>Numéro WhatsApp</span>
          <strong>{whatsapp}</strong>
        </div>
        <BadgeCheck size={18} className="hero-card__check" />
      </div>

      <div
        className="hero-card__bar"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Avancement du dossier"
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="hero-card__progress">
        <span>{progressStage(progress)}</span>
        <strong>{progress}%</strong>
      </div>

      <p className="hero-card__hint">
        <Sparkles size={14} />{' '}
        {featured
          ? 'Dossier accepté — accompagnement en cours'
          : 'Étude en cours par le comité franco-américain'}
      </p>
    </div>
  )
}
