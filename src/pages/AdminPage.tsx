import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  AlertCircle,
  Check,
  Clock,
  ImagePlus,
  Inbox,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  X,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { PromoterImageManager } from '../components/PromoterImageManager'
import { SECTORS } from '../data/content'
import {
  fetchApplications,
  isSupabaseConfigured,
  updateApplicationProgress,
  updateApplicationStatus,
} from '../lib/supabase'
import {
  formatCurrency,
  formatDate,
  prettyWhatsapp,
  progressStage,
} from '../lib/format'
import { buildDecisionMessage, buildWhatsappLink } from '../lib/whatsapp'
import { isAdminUnlocked, lockAdmin } from '../lib/adminAuth'
import type { Application, ApplicationStatus } from '../types'
import './AdminPage.css'

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'En attente',
  approved: 'Acceptée',
  rejected: 'Refusée',
}

type Filter = 'all' | ApplicationStatus

function sectorLabel(value: string): string {
  return SECTORS.find((sector) => sector.value === value)?.label ?? value
}

function firstName(fullName: string): string {
  return fullName.split(' ')[0] || fullName
}

/** Garantit un entier entre 0 et 100 (même si la valeur est absente). */
function clampProgress(value: unknown): number {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.min(100, Math.max(0, Math.round(number)))
}

interface SupabaseErrorLike {
  message?: unknown
  details?: unknown
  hint?: unknown
  code?: unknown
}

/**
 * Extrait un message lisible depuis n'importe quelle erreur.
 * Les erreurs Supabase sont des OBJETS simples (et non des `Error`) :
 * on ne peut donc pas se fier à `instanceof Error`.
 */
function rawErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error

  if (error && typeof error === 'object') {
    const { message, details, hint, code } = error as SupabaseErrorLike
    const parts: string[] = []

    if (typeof message === 'string' && message) parts.push(message)
    if (typeof details === 'string' && details) parts.push(`détails : ${details}`)
    if (typeof hint === 'string' && hint) parts.push(`astuce : ${hint}`)
    if (typeof code === 'string' && code) parts.push(`code ${code}`)

    if (parts.length > 0) return parts.join(' · ')
  }

  return ''
}

/** Traduit une erreur technique en explication actionnable. */
function friendlyError(error: unknown): string {
  const raw = rawErrorMessage(error)
  const message = raw.toLowerCase()

  if (message.includes('aucune ligne')) {
    return "Le pourcentage n'a pas pu être enregistré : les règles de sécurité de Supabase bloquent la modification. Ouvrez Supabase → SQL Editor et exécutez le fichier supabase/fix-progress.sql."
  }
  if (message.includes('progress') && message.includes('column')) {
    return "La colonne « progress » est absente de votre base. Ouvrez Supabase → SQL Editor et exécutez le fichier supabase/fix-progress.sql."
  }
  if (message.includes('does not exist')) {
    return "La table « applications » est absente. Ouvrez Supabase → SQL Editor et exécutez supabase/schema.sql."
  }
  if (message.includes('policy') || message.includes('row-level security')) {
    return "Écriture refusée par les règles de sécurité. Exécutez supabase/fix-progress.sql dans Supabase → SQL Editor."
  }
  if (message.includes('invalid api key') || message.includes('jwt')) {
    return 'Clés Supabase invalides. Vérifiez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans le fichier .env.'
  }
  if (raw) return raw

  return 'Mise à jour impossible. Appuyez sur F12 → onglet Console pour voir le détail.'
}

const STAT_ICONS = { total: Users, pending: Clock, approved: Check, rejected: X }

/** Raccourcis d'avancement affichés sous le curseur. */
const PROGRESS_PRESETS = [
  { label: 'Reçu', value: 10 },
  { label: 'Vérification', value: 35 },
  { label: 'Comité', value: 60 },
  { label: 'Finalisation', value: 85 },
  { label: 'Décaissé', value: 100 },
]

export function AdminPage() {
  const [unlocked, setUnlocked] = useState(isAdminUnlocked)
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return
    try {
      setApps(await fetchApplications())
      setError(null)
    } catch (err) {
      setError(friendlyError(err))
      setErrorDetail(rawErrorMessage(err) || null)
    } finally {
      setLoading(false)
    }
  }, [])

  function refresh() {
    setError(null)
    setLoading(true)
    void load()
  }

  useEffect(() => {
    if (unlocked) void load()
  }, [unlocked, load])

  function handleLock() {
    lockAdmin()
    setUnlocked(false)
  }

  async function applyStatus(app: Application, status: ApplicationStatus) {
    setBusyId(app.id)
    setError(null)
    try {
      await updateApplicationStatus(app.id, status)

      // Une demande acceptée passe automatiquement au stade « en étude » :
      // la barre de progression démarre à 25 % si elle était à zéro.
      let progress = clampProgress(app.progress)
      if (status === 'approved' && progress === 0) {
        progress = 25
        await updateApplicationProgress(app.id, progress)
      }

      setApps((prev) =>
        prev.map((item) =>
          item.id === app.id ? { ...item, status, progress } : item,
        ),
      )
      setErrorDetail(null)
    } catch (err) {
      setError(friendlyError(err))
      setErrorDetail(rawErrorMessage(err) || null)
    } finally {
      setBusyId(null)
    }
  }

  /** Règle la barre de progression d'un dossier (pilotée depuis l'admin). */
  async function applyProgress(app: Application, progress: number) {
    const next = clampProgress(progress)
    if (next === clampProgress(app.progress)) return

    setBusyId(app.id)
    setError(null)
    try {
      await updateApplicationProgress(app.id, next)
      setApps((prev) =>
        prev.map((item) => (item.id === app.id ? { ...item, progress: next } : item)),
      )
      setErrorDetail(null)
    } catch (err) {
      setError(friendlyError(err))
      setErrorDetail(rawErrorMessage(err) || null)
    } finally {
      setBusyId(null)
    }
  }

  function openWhatsapp(
    app: Application,
    decision: 'approved' | 'rejected' | 'free',
  ) {
    const message =
      decision === 'free'
        ? `Bonjour ${firstName(app.full_name)}, la Fondation Musk vous contacte au sujet de votre demande « ${app.project_title} ».`
        : buildDecisionMessage(app, decision)
    window.open(buildWhatsappLink(app.whatsapp, message), '_blank', 'noopener')
  }

  const stats = useMemo(
    () => ({
      total: apps.length,
      pending: apps.filter((a) => a.status === 'pending').length,
      approved: apps.filter((a) => a.status === 'approved').length,
      rejected: apps.filter((a) => a.status === 'rejected').length,
      amount: apps.reduce((sum, a) => sum + (a.amount_requested || 0), 0),
    }),
    [apps],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return apps.filter((app) => {
      if (filter !== 'all' && app.status !== filter) return false
      if (!q) return true
      return [
        app.reference ?? '',
        app.full_name,
        app.project_title,
        app.whatsapp,
        app.email,
        app.country,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [apps, filter, query])

  if (!unlocked) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <section className="section admin">
      <div className="container">
        <header className="admin__head">
          <div>
            <span className="eyebrow">Espace administrateur</span>
            <h1 className="admin__title">Demandes de financement</h1>
            <p className="admin__sub">
              Étudiez les dossiers et contactez chaque candidat sur son numéro
              WhatsApp en un clic.
            </p>
          </div>
          <div className="admin__head-actions">
            <a href="#promoter-image" className="btn btn--ghost">
              <ImagePlus size={17} /> Image du promoteur
            </a>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={refresh}
              disabled={loading}
            >
              <RefreshCw size={17} /> Actualiser
            </button>
            <button type="button" className="btn btn--outline" onClick={handleLock}>
              <LogOut size={17} /> Se déconnecter
            </button>
          </div>
        </header>

        {!isSupabaseConfigured && (
          <div className="alert alert--warning admin__alert">
            <AlertCircle size={18} />
            <span>
              Supabase n’est pas configuré. Ajoutez{' '}
              <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code>{' '}
              dans le fichier <code>.env</code> puis redémarrez le serveur.
            </span>
          </div>
        )}

        <div className="admin-stats">
          <StatCard icon={STAT_ICONS.total} label="Demandes reçues" value={stats.total} />
          <StatCard
            icon={STAT_ICONS.pending}
            label="En attente"
            value={stats.pending}
            tone="pending"
          />
          <StatCard
            icon={STAT_ICONS.approved}
            label="Acceptées"
            value={stats.approved}
            tone="approved"
          />
          <StatCard
            icon={STAT_ICONS.rejected}
            label="Refusées"
            value={stats.rejected}
            tone="rejected"
          />
          <StatCard
            icon={TrendingUp}
            label="Montant cumulé demandé"
            value={formatCurrency(stats.amount, 'USD')}
            tone="accent"
          />
        </div>

        <div className="admin-toolbar">
          <div className="admin-filters">
            {(['all', 'pending', 'approved', 'rejected'] as Filter[]).map((key) => (
              <button
                key={key}
                type="button"
                className={`admin-filter${filter === key ? ' is-active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {key === 'all' ? 'Toutes' : STATUS_LABELS[key]}
              </button>
            ))}
          </div>
          <div className="admin-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Rechercher un nom, un projet, un numéro…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="alert alert--error admin__alert">
            <AlertCircle size={18} />
            <div className="admin__alert-body">
              <strong>{error}</strong>
              {errorDetail && (
                <details>
                  <summary>Voir le détail technique</summary>
                  <code>{errorDetail}</code>
                </details>
              )}
            </div>
            <button
              type="button"
              className="admin__alert-close"
              aria-label="Fermer le message"
              onClick={() => {
                setError(null)
                setErrorDetail(null)
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="admin-empty">
            <span className="spinner" />
            <p>Chargement des demandes…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <Inbox size={30} />
            <p>
              {apps.length === 0
                ? 'Aucune demande pour le moment. Les dossiers déposés apparaîtront ici.'
                : 'Aucune demande ne correspond à votre recherche.'}
            </p>
          </div>
        ) : (
          <div className="admin-list">
            {filtered.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                busy={busyId === app.id}
                expanded={expandedId === app.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === app.id ? null : app.id))
                }
                onApprove={() => void applyStatus(app, 'approved')}
                onReject={() => void applyStatus(app, 'rejected')}
                onReset={() => void applyStatus(app, 'pending')}
                onWhatsapp={(decision) => openWhatsapp(app, decision)}
                onProgressChange={(value) => void applyProgress(app, value)}
              />
            ))}
          </div>
        )}

        <PromoterImageManager />
      </div>
    </section>
  )
}

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  tone?: 'default' | 'pending' | 'approved' | 'rejected' | 'accent'
}

function StatCard({ icon: Icon, label, value, tone = 'default' }: StatCardProps) {
  return (
    <div className={`admin-stat admin-stat--${tone}`}>
      <span className="admin-stat__icon">
        <Icon size={17} />
      </span>
      <strong>{value}</strong>
      <span className="admin-stat__label">{label}</span>
    </div>
  )
}

interface ApplicationCardProps {
  app: Application
  busy: boolean
  expanded: boolean
  onToggle: () => void
  onApprove: () => void
  onReject: () => void
  onReset: () => void
  onWhatsapp: (decision: 'approved' | 'rejected' | 'free') => void
  onProgressChange: (progress: number) => void
}

function ApplicationCard({
  app,
  busy,
  expanded,
  onToggle,
  onApprove,
  onReject,
  onReset,
  onWhatsapp,
  onProgressChange,
}: ApplicationCardProps) {
  const serverProgress = clampProgress(app.progress)
  const [draft, setDraft] = useState(serverProgress)
  const [synced, setSynced] = useState(serverProgress)

  // Resynchronise le curseur lorsque la valeur change côté serveur.
  if (serverProgress !== synced) {
    setSynced(serverProgress)
    setDraft(serverProgress)
  }

  return (
    <article className={`app-card${expanded ? ' is-expanded' : ''}`}>
      <div className="app-card__top">
        <div className="app-card__identity">
          <h3>{app.project_title}</h3>
          <p className="app-card__meta">
            <span className="app-card__ref">{app.reference ?? '—'}</span>
            <span>{app.full_name}</span>
            <span>
              <MapPin size={13} />
              {app.city ? `${app.city}, ` : ''}
              {app.country}
            </span>
            <span>{sectorLabel(app.project_sector)}</span>
          </p>
        </div>
        <div className="app-card__right">
          <span className="app-card__amount">
            {formatCurrency(app.amount_requested, app.currency)}
          </span>
          <span className={`badge badge--${app.status}`}>
            {STATUS_LABELS[app.status]}
          </span>
        </div>
      </div>

      <div className="app-card__contacts">
        <a
          className="app-contact app-contact--whatsapp"
          href={buildWhatsappLink(
            app.whatsapp,
            `Bonjour ${firstName(app.full_name)}, ici la Fondation Musk au sujet de votre demande « ${app.project_title} » — référence ${app.reference ?? 'non attribuée'}.`,
          )}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={16} /> {prettyWhatsapp(app.whatsapp)}
        </a>
        <a className="app-contact" href={`mailto:${app.email}`}>
          <Mail size={16} /> {app.email}
        </a>
        {app.phone && (
          <a className="app-contact" href={`tel:${app.phone}`}>
            <Phone size={16} /> {app.phone}
          </a>
        )}
        <span className="app-contact app-contact--date">
          <Clock size={16} /> {formatDate(app.created_at)}
        </span>
      </div>

      {expanded && (
        <div className="app-card__details">
          <h4>Description du projet</h4>
          <p>{app.project_description}</p>
        </div>
      )}

      <div className="app-card__progress">
        <div className="app-card__progress-head">
          <span>Avancement — {progressStage(draft)}</span>
          <strong>{draft}%</strong>
        </div>

        <div className="app-card__progress-bar">
          <span style={{ width: `${draft}%` }} />
        </div>

        <div className="app-card__progress-row">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={draft}
            disabled={busy}
            aria-label="Avancement du dossier"
            onChange={(event) => setDraft(Number(event.target.value))}
            onPointerUp={() => onProgressChange(draft)}
            onTouchEnd={() => onProgressChange(draft)}
            onKeyUp={() => onProgressChange(draft)}
          />

          <div className="app-card__progress-presets">
            {PROGRESS_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={`chip${draft === preset.value ? ' is-active' : ''}`}
                disabled={busy}
                onClick={() => {
                  setDraft(preset.value)
                  onProgressChange(preset.value)
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="app-card__actions">
        <button type="button" className="btn btn--ghost btn--sm" onClick={onToggle}>
          {expanded ? 'Masquer le détail' : 'Voir le détail'}
        </button>
        <span className="app-card__spacer" />

        {app.status !== 'approved' && (
          <button
            type="button"
            className="btn btn--sm app-btn-approve"
            onClick={onApprove}
            disabled={busy}
          >
            <Check size={16} /> Accepter
          </button>
        )}
        {app.status !== 'rejected' && (
          <button
            type="button"
            className="btn btn--sm app-btn-reject"
            onClick={onReject}
            disabled={busy}
          >
            <XCircle size={16} /> Refuser
          </button>
        )}
        {app.status !== 'pending' && (
          <button
            type="button"
            className="btn btn--sm app-btn-reset"
            onClick={onReset}
            disabled={busy}
          >
            <RefreshCw size={16} /> Remettre en attente
          </button>
        )}
        {app.status === 'approved' && (
          <button
            type="button"
            className="btn btn--sm app-btn-wa"
            onClick={() => onWhatsapp('approved')}
          >
            <MessageCircle size={16} /> Annoncer l’acceptation
          </button>
        )}
        {app.status === 'rejected' && (
          <button
            type="button"
            className="btn btn--sm app-btn-wa"
            onClick={() => onWhatsapp('rejected')}
          >
            <MessageCircle size={16} /> Annoncer le refus
          </button>
        )}
        {app.status === 'pending' && (
          <button
            type="button"
            className="btn btn--sm app-btn-wa"
            onClick={() => onWhatsapp('free')}
          >
            <MessageCircle size={16} /> Contacter
          </button>
        )}
      </div>

      {busy && (
        <div className="app-card__busy">
          <span className="spinner" />
        </div>
      )}
    </article>
  )
}

/* L'authentification se fait désormais sur /admin/login (AdminLoginPage). */





