import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Rocket,
  Send,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react'
import {
  COUNTRIES,
  CURRENCIES,
  MAX_AMOUNT,
  MIN_AMOUNT,
  SECTORS,
  SITE,
  TIMELINES,
} from '../data/content'
import { createApplication, isSupabaseConfigured } from '../lib/supabase'
import { formatCurrency } from '../lib/format'
import type { ApplicationPayload } from '../types'
import './ApplyPage.css'

interface FormState {
  full_name: string
  email: string
  phone: string
  whatsapp: string
  country: string
  city: string
  project_title: string
  project_sector: string
  amount_requested: string
  currency: string
  timeline: string
  project_description: string
}

const INITIAL_FORM: FormState = {
  full_name: '',
  email: '',
  phone: '',
  whatsapp: '',
  country: 'France',
  city: '',
  project_title: '',
  project_sector: 'technologie',
  amount_requested: '',
  currency: 'USD',
  timeline: 'immediat',
  project_description: '',
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

function validate(form: FormState, consent: boolean): Record<string, string> {
  const errors: Record<string, string> = {}

  if (form.full_name.trim().length < 3) {
    errors.full_name = 'Indiquez votre nom et prénom complets.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Adresse e-mail invalide.'
  }
  if (form.phone.replace(/[^\d]/g, '').length < 6) {
    errors.phone = 'Numéro de téléphone invalide.'
  }
  if (form.whatsapp.replace(/[^\d]/g, '').length < 8) {
    errors.whatsapp =
      'Numéro WhatsApp invalide. Ajoutez l’indicatif pays (ex : +33 ou +1).'
  }
  if (!form.project_title.trim()) {
    errors.project_title = 'Donnez un titre à votre projet.'
  }

  const amount = Number(form.amount_requested)
  if (!form.amount_requested || Number.isNaN(amount)) {
    errors.amount_requested = 'Indiquez le montant souhaité.'
  } else if (amount < MIN_AMOUNT) {
    errors.amount_requested = `Le montant minimum est de ${formatCurrency(MIN_AMOUNT, form.currency)}.`
  } else if (amount > MAX_AMOUNT) {
    errors.amount_requested = `Le montant maximum est de ${formatCurrency(MAX_AMOUNT, form.currency)}.`
  }

  if (form.project_description.trim().length < 40) {
    errors.project_description =
      'Décrivez votre projet en quelques phrases (40 caractères minimum).'
  }
  if (!consent) {
    errors.consent = 'Merci d’accepter le traitement de votre demande.'
  }

  return errors
}

export function ApplyPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<{
    payload: ApplicationPayload
    reference: string
  } | null>(null)

  function update(key: keyof FormState) {
    return (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
      const { value } = event.target
      setForm((prev) => ({ ...prev, [key]: value }))
      setErrors((prev) => {
        if (!prev[key]) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(form, consent)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0]
      document
        .getElementById(`field-${firstKey}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setStatus('submitting')
    setSubmitError(null)

    try {
      const payload: ApplicationPayload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim(),
        country: form.country,
        city: form.city.trim(),
        project_title: form.project_title.trim(),
        project_sector: form.project_sector,
        project_description: form.project_description.trim(),
        amount_requested: Number(form.amount_requested),
        currency: form.currency,
        timeline: form.timeline,
      }

      const { reference } = await createApplication(payload)
      setSubmitted({ payload, reference })
      setStatus('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setStatus('error')
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de l’envoi. Merci de réessayer.',
      )
    }
  }

  function resetForm() {
    setForm(INITIAL_FORM)
    setConsent(false)
    setErrors({})
    setStatus('idle')
    setSubmitError(null)
    setSubmitted(null)
  }

  return (
    <>
      <section className="apply-hero">
        <div className="container apply-hero__inner">
          <span className="eyebrow">Demande de financement</span>
          <h1>
            Parlons de <span className="grad-text">votre projet</span>
          </h1>
          <p>
            Remplissez le formulaire ci-dessous. Indiquez le montant dont vous avez
            besoin et surtout votre numéro WhatsApp : c’est sur ce numéro que nous
            vous informerons de notre décision.
          </p>
          <ul className="apply-hero__flow">
            <li>
              <span>1</span> Vous décrivez votre projet
            </li>
            <li>
              <span>2</span> Notre comité étudie le dossier
            </li>
            <li>
              <span>3</span> Vous êtes informé par WhatsApp
            </li>
          </ul>
        </div>
      </section>

      <section className="section apply">
        <div className="container apply__inner">
          <div className="apply__main">
            {!isSupabaseConfigured && (
              <div className="alert alert--warning">
                <AlertCircle size={18} />
                <span>
                  La base de données n’est pas encore connectée. Renseignez{' '}
                  <code>VITE_SUPABASE_URL</code> et{' '}
                  <code>VITE_SUPABASE_ANON_KEY</code> dans le fichier{' '}
                  <code>.env</code> pour activer l’enregistrement des demandes.
                </span>
              </div>
            )}

            {status === 'success' && submitted ? (
              <SuccessCard
                payload={submitted.payload}
                reference={submitted.reference}
                onReset={resetForm}
              />
            ) : (
              <form className="apply-form" onSubmit={handleSubmit} noValidate>
                <header className="apply-form__head">
                  <h2>Formulaire de candidature</h2>
                  <p>
                    Les champs marqués d’un <span className="req">*</span> sont
                    obligatoires.
                  </p>
                </header>

                <div className="form-grid">
                  <div
                    className={`field field--full${errors.full_name ? ' field--invalid' : ''}`}
                    id="field-full_name"
                  >
                    <label htmlFor="full_name">
                      Nom et prénom <span className="req">*</span>
                    </label>
                    <div className="icon-input">
                      <User size={18} />
                      <input
                        id="full_name"
                        className="input"
                        type="text"
                        autoComplete="name"
                        placeholder="Ex : Camille Deschamps"
                        value={form.full_name}
                        onChange={update('full_name')}
                      />
                    </div>
                    <FieldError message={errors.full_name} />
                  </div>

                  <div
                    className={`field${errors.email ? ' field--invalid' : ''}`}
                    id="field-email"
                  >
                    <label htmlFor="email">
                      Adresse e-mail <span className="req">*</span>
                    </label>
                    <div className="icon-input">
                      <Mail size={18} />
                      <input
                        id="email"
                        className="input"
                        type="email"
                        autoComplete="email"
                        placeholder="vous@exemple.com"
                        value={form.email}
                        onChange={update('email')}
                      />
                    </div>
                    <FieldError message={errors.email} />
                  </div>

                  <div
                    className={`field${errors.phone ? ' field--invalid' : ''}`}
                    id="field-phone"
                  >
                    <label htmlFor="phone">
                      Téléphone <span className="req">*</span>
                    </label>
                    <div className="icon-input">
                      <Phone size={18} />
                      <input
                        id="phone"
                        className="input"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+33 6 12 34 56 78"
                        value={form.phone}
                        onChange={update('phone')}
                      />
                    </div>
                    <FieldError message={errors.phone} />
                  </div>

                  <div
                    className={`field field--full whatsapp-field${errors.whatsapp ? ' field--invalid' : ''}`}
                    id="field-whatsapp"
                  >
                    <label htmlFor="whatsapp">
                      Numéro WhatsApp <span className="req">*</span>
                    </label>
                    <div className="icon-input">
                      <MessageCircle size={18} />
                      <input
                        id="whatsapp"
                        className="input"
                        type="tel"
                        placeholder="+33 6 12 34 56 78 ou +1 415 555 0123"
                        value={form.whatsapp}
                        onChange={update('whatsapp')}
                      />
                    </div>
                    <span className="hint">
                      C’est sur ce numéro que nous vous contacterons pour vous
                      annoncer la décision. N’oubliez pas l’indicatif pays.
                    </span>
                    <FieldError message={errors.whatsapp} />
                  </div>

                  <div className="field">
                    <label htmlFor="country">
                      Pays <span className="req">*</span>
                    </label>
                    <select
                      id="country"
                      className="select"
                      value={form.country}
                      onChange={update('country')}
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="city">Ville</label>
                    <input
                      id="city"
                      className="input"
                      type="text"
                      placeholder="Ex : Lyon"
                      value={form.city}
                      onChange={update('city')}
                    />
                  </div>

                  <div
                    className={`field field--full${errors.project_title ? ' field--invalid' : ''}`}
                    id="field-project_title"
                  >
                    <label htmlFor="project_title">
                      Titre du projet <span className="req">*</span>
                    </label>
                    <div className="icon-input">
                      <Rocket size={18} />
                      <input
                        id="project_title"
                        className="input"
                        type="text"
                        placeholder="Ex : SolarLeaf — énergie solaire accessible"
                        value={form.project_title}
                        onChange={update('project_title')}
                      />
                    </div>
                    <FieldError message={errors.project_title} />
                  </div>

                  <div className="field">
                    <label htmlFor="project_sector">Secteur du projet</label>
                    <select
                      id="project_sector"
                      className="select"
                      value={form.project_sector}
                      onChange={update('project_sector')}
                    >
                      {SECTORS.map((sector) => (
                        <option key={sector.value} value={sector.value}>
                          {sector.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    className={`field${errors.amount_requested ? ' field--invalid' : ''}`}
                    id="field-amount_requested"
                  >
                    <label htmlFor="amount_requested">
                      Montant souhaité <span className="req">*</span>
                    </label>
                    <div className="amount-row">
                      <div className="icon-input amount-row__input">
                        <Wallet size={18} />
                        <input
                          id="amount_requested"
                          className="input"
                          type="number"
                          inputMode="numeric"
                          min={MIN_AMOUNT}
                          max={MAX_AMOUNT}
                          step={500}
                          placeholder="Ex : 85000"
                          value={form.amount_requested}
                          onChange={update('amount_requested')}
                        />
                      </div>
                      <select
                        className="select amount-row__currency"
                        aria-label="Devise"
                        value={form.currency}
                        onChange={update('currency')}
                      >
                        {CURRENCIES.map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="hint">
                      De {formatCurrency(MIN_AMOUNT, form.currency)} à{' '}
                      {formatCurrency(MAX_AMOUNT, form.currency)}.
                    </span>
                    <FieldError message={errors.amount_requested} />
                  </div>

                  <div className="field field--full">
                    <label>Dans quel délai avez-vous besoin des fonds ?</label>
                    <div className="chips">
                      {TIMELINES.map((timeline) => (
                        <button
                          key={timeline.value}
                          type="button"
                          className={`chip${form.timeline === timeline.value ? ' is-active' : ''}`}
                          onClick={() =>
                            setForm((prev) => ({ ...prev, timeline: timeline.value }))
                          }
                        >
                          {timeline.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`field field--full${errors.project_description ? ' field--invalid' : ''}`}
                    id="field-project_description"
                  >
                    <label htmlFor="project_description">
                      Description du projet <span className="req">*</span>
                    </label>
                    <textarea
                      id="project_description"
                      className="textarea"
                      placeholder="Décrivez votre projet, le problème qu’il résout, où vous en êtes et comment ce financement vous aidera à avancer."
                      value={form.project_description}
                      onChange={update('project_description')}
                    />
                    <FieldError message={errors.project_description} />
                  </div>
                </div>

                <label
                  className={`consent${errors.consent ? ' consent--invalid' : ''}`}
                  id="field-consent"
                >
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => {
                      setConsent(event.target.checked)
                      setErrors((prev) => {
                        if (!prev.consent) return prev
                        const next = { ...prev }
                        delete next.consent
                        return next
                      })
                    }}
                  />
                  <span>
                    J’accepte que la Fondation Musk utilise les informations
                    fournies pour étudier ma demande et me contacter, notamment par
                    WhatsApp.
                  </span>
                </label>
                <FieldError message={errors.consent} />

                {status === 'error' && submitError && (
                  <div className="alert alert--error">
                    <AlertCircle size={18} />
                    <span>{submitError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn--primary btn--lg btn--block"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="spinner" /> Envoi en cours…
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Soumettre ma demande
                    </>
                  )}
                </button>

                <p className="apply-form__note">
                  <ShieldCheck size={15} /> Vos données restent confidentielles et
                  servent uniquement à l’étude de votre dossier.
                </p>
              </form>
            )}
          </div>

          <aside className="apply__aside">
            <div className="aside-card">
              <h3>
                <BadgeCheck size={18} /> Critères d’éligibilité
              </h3>
              <ul>
                <li>Projet à impact humain, social, scientifique ou environnemental</li>
                <li>Porté depuis la France, les États-Unis ou un autre pays</li>
                <li>Montant demandé entre 1 000 $ et 5 000 000 $</li>
                <li>Un numéro WhatsApp actif pour être contacté</li>
              </ul>
            </div>

            <div className="aside-card aside-card--whatsapp">
              <h3>
                <MessageCircle size={18} /> Un doute ? Écrivez-nous
              </h3>
              <p>
                Notre équipe répond à vos questions sur WhatsApp avant même que
                vous déposiez votre dossier.
              </p>
              <a
                href={SITE.whatsappPublicLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn--gold btn--block"
              >
                <MessageCircle size={18} /> {SITE.whatsappPublic}
              </a>
            </div>

            <div className="aside-card aside-card--muted">
              <h3>
                <Clock size={18} /> Délais de traitement
              </h3>
              <p>
                Accusé de réception immédiat, puis décision sous 7 à 21 jours
                ouvrés. Vous êtes informé par WhatsApp dans tous les cas.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

interface SuccessCardProps {
  payload: ApplicationPayload
  reference: string
  onReset: () => void
}

function SuccessCard({ payload, reference, onReset }: SuccessCardProps) {
  return (
    <div className="success-card">
      <span className="success-card__icon">
        <CheckCircle2 size={34} />
      </span>
      <h2>Votre demande a bien été envoyée 🎉</h2>
      <p>
        Merci <strong>{payload.full_name}</strong>. Votre dossier est enregistré
        et va être étudié par notre comité franco-américain.
      </p>

      <dl className="success-card__summary">
        <div>
          <dt>Projet</dt>
          <dd>{payload.project_title}</dd>
        </div>
        <div>
          <dt>Montant demandé</dt>
          <dd>{formatCurrency(payload.amount_requested, payload.currency)}</dd>
        </div>
        <div>
          <dt>Numéro WhatsApp</dt>
          <dd>{payload.whatsapp}</dd>
        </div>
        <div>
          <dt>Référence du dossier</dt>
          <dd className="success-card__ref">{reference}</dd>
        </div>
      </dl>

      <div className="alert alert--success">
        <MessageCircle size={18} />
        <span>
          Nous vous contacterons au <strong>{payload.whatsapp}</strong> pour vous
          annoncer la décision. Pensez à garder WhatsApp accessible.
        </span>
      </div>

      <div className="success-card__actions">
        <Link to="/" className="btn btn--primary">
          Retour à l’accueil <ArrowRight size={18} />
        </Link>
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          <RefreshCw size={18} /> Envoyer une autre demande
        </button>
      </div>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <span className="field__error">
      <AlertCircle size={14} /> {message}
    </span>
  )
}





