import { Link } from 'react-router-dom'

interface LogoProps {
  /** Affiche uniquement l'emblème, sans le texte. */
  compact?: boolean
}

/**
 * Emblème + nom de la Fondation Musk.
 * L'emblème est un monogramme « M » orbital : une trajectoire tournant
 * autour d'un noyau, en écho à l'ambition d'aller toujours plus loin.
 */
export function Logo({ compact = false }: LogoProps) {
  return (
    <Link to="/" className="brand" aria-label="Fondation Musk — Accueil">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="presentation">
          <defs>
            <linearGradient id="fm-mark" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#5b8cff" />
              <stop offset="0.55" stopColor="#2f6bff" />
              <stop offset="1" stopColor="#19c7d6" />
            </linearGradient>
            <linearGradient id="fm-gold" x1="14" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffe6a3" />
              <stop offset="1" stopColor="#e6ad3f" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="21" fill="url(#fm-mark)" />
          <ellipse
            cx="24"
            cy="24"
            rx="21"
            ry="9.5"
            fill="none"
            stroke="url(#fm-gold)"
            strokeWidth="1.6"
            strokeOpacity="0.85"
            transform="rotate(-32 24 24)"
          />
          <path
            d="M14.5 32.5V16.5l9.5 9.6 9.5-9.6v16"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="34.6" cy="13.2" r="2.1" fill="#ffe6a3" />
        </svg>
      </span>
      {!compact && (
        <span className="brand__text">
          <strong>Fondation</strong>
          <em>Musk</em>
        </span>
      )}
    </Link>
  )
}
