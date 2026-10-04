import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function NotFoundPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="notfound">
          <span className="eyebrow">Erreur 404</span>
          <h1>Cette page s’est envolée dans l’espace</h1>
          <p>
            La page que vous recherchez n’existe pas ou a été déplacée. Revenez
            à l’accueil pour poursuivre votre demande de financement.
          </p>
          <Link to="/" className="btn btn--primary btn--lg">
            Retour à l’accueil
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
