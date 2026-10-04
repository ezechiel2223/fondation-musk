import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Lock, ShieldCheck } from 'lucide-react'
import { checkPasscode, isAdminUnlocked, unlockAdmin } from '../lib/adminAuth'
import './AdminPage.css'

/**
 * Connexion à l'espace administrateur.
 * Accessible uniquement en saisissant l'URL `/admin/login`.
 */
export function AdminLoginPage() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  // Déjà authentifié pour cette session : direction le tableau de bord.
  if (isAdminUnlocked()) {
    return <Navigate to="/admin" replace />
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (checkPasscode(value)) {
      unlockAdmin()
      navigate('/admin', { replace: true })
    } else {
      setError(true)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <form className="admin-gate" onSubmit={submit}>
          <span className="admin-gate__icon">
            <Lock size={26} />
          </span>
          <h1>Espace administrateur</h1>
          <p>
            Accès réservé à l’équipe de la Fondation. Entrez le code d’accès pour
            consulter les demandes et contacter les candidats par WhatsApp.
          </p>

          <div className={`field field--full${error ? ' field--invalid' : ''}`}>
            <input
              type="password"
              className="input"
              placeholder="Code d’accès"
              value={value}
              autoFocus
              onChange={(event) => {
                setValue(event.target.value)
                setError(false)
              }}
            />
            {error && (
              <span className="field__error">
                <AlertCircle size={14} /> Code d’accès incorrect.
              </span>
            )}
          </div>

          <button type="submit" className="btn btn--primary btn--block">
            <ShieldCheck size={18} /> Se connecter
          </button>

          <Link to="/" className="admin-gate__back">
            <ArrowLeft size={15} /> Retour au site
          </Link>

          <p className="admin-gate__note">
            <AlertCircle size={14} /> Protection côté client : le code est défini
            dans le fichier <code>.env</code> (VITE_ADMIN_PASSCODE). Pour la
            production, activez Supabase Auth et les règles RLS.
          </p>
        </form>
      </div>
    </section>
  )
}
