import { MessageCircle } from 'lucide-react'
import { ONGOING_REQUESTS, type OngoingRequest } from '../data/content'
import { formatCurrency } from '../lib/format'
import { Reveal } from './Reveal'
import './OngoingRequests.css'

interface RequestCardProps {
  request: OngoingRequest
  /** Copie dupliquée servant à la boucle : masquée aux lecteurs d'écran. */
  duplicate?: boolean
}

function RequestCard({ request, duplicate = false }: RequestCardProps) {
  return (
    <article className="request-card" aria-hidden={duplicate || undefined}>
      <div className="request-card__top">
        <span className="request-card__ref">{request.ref}</span>
        <span
          className={`request-card__status request-card__status--${request.tone}`}
        >
          <span className="request-card__dot" />
          {request.stage}
        </span>
      </div>

      <h3 className="request-card__project">{request.project}</h3>

      <p className="request-card__meta">
        <span>
          {request.flag} {request.city}, {request.country}
        </span>
        <span>{request.sector}</span>
      </p>

      <div className="request-card__bottom">
        <strong>{formatCurrency(request.amount, request.currency)}</strong>
        <span className="request-card__wa">
          <MessageCircle size={14} /> Suivi WhatsApp
        </span>
      </div>
    </article>
  )
}

/**
 * Bandeau de dossiers en cours : deux rangées qui défilent en boucle,
 * dans des directions opposées, et se mettent en pause au survol.
 */
export function OngoingRequests() {
  const half = Math.ceil(ONGOING_REQUESTS.length / 2)
  const rows = [ONGOING_REQUESTS.slice(0, half), ONGOING_REQUESTS.slice(half)]

  return (
    <section className="ongoing" aria-label="Dossiers en cours d’étude">
      <div className="container ongoing__head">
        <Reveal className="ongoing__intro">
          <span className="eyebrow">Dossiers en cours</span>
          <h2 className="section-title">
            Des projets qui avancent, <span className="grad-text">maintenant</span>
          </h2>
          <p className="section-lead">
            Aperçu anonymisé des demandes actuellement examinées par le comité
            franco-américain. Chaque candidat est informé de la décision
            directement sur WhatsApp.
          </p>
        </Reveal>

        <span className="ongoing__live">
          <span className="ongoing__live-dot" />
          {ONGOING_REQUESTS.length} dossiers suivis
        </span>
      </div>

      <div className="ongoing__rows">
        {rows.map((row, rowIndex) => (
          <div
            className={`marquee${rowIndex === 1 ? ' marquee--reverse' : ''}`}
            key={rowIndex === 0 ? 'row-a' : 'row-b'}
          >
            <div
              className="marquee__track"
              style={{ animationDuration: rowIndex === 0 ? '46s' : '58s' }}
            >
              {row.map((request) => (
                <RequestCard key={request.ref} request={request} />
              ))}
              {row.map((request) => (
                <RequestCard
                  key={`${request.ref}-copy`}
                  request={request}
                  duplicate
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
