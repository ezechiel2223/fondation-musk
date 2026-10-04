import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { AlertCircle, CheckCircle2, ImagePlus, Trash2, Upload } from 'lucide-react'
import { PROMOTER } from '../data/content'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  PROMOTER_IMAGE_KEY,
  fetchSetting,
  saveSetting,
  uploadPromoterImage,
  validateImageFile,
} from '../lib/settings'
import './PromoterImageManager.css'

/**
 * Réglage de l'image du promoteur depuis l'espace administrateur.
 * L'image est envoyée dans Supabase Storage (bucket `media`) et son URL est
 * enregistrée dans la table `site_settings` : la page d'accueil la récupère
 * automatiquement.
 */
export function PromoterImageManager() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true
    fetchSetting(PROMOTER_IMAGE_KEY)
      .then((url) => {
        if (active) setCurrentUrl(url)
      })
      .catch(() => {
        /* silencieux */
      })

    return () => {
      active = false
    }
  }, [])

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const problem = validateImageFile(file)
    if (problem) {
      setMessage({ type: 'error', text: problem })
      return
    }

    setMessage(null)
    setFailed(false)
    setPreview(URL.createObjectURL(file))
  }

  async function handleUpload() {
    const file = inputRef.current?.files?.[0]
    if (!file) {
      setMessage({ type: 'error', text: 'Choisissez d’abord une image.' })
      return
    }

    setSaving(true)
    setMessage(null)
    try {
      const url = await uploadPromoterImage(file)
      await saveSetting(PROMOTER_IMAGE_KEY, url)
      setCurrentUrl(url)
      setPreview(null)
      setFailed(false)
      if (inputRef.current) inputRef.current.value = ''
      setMessage({
        type: 'success',
        text: 'Image enregistrée ! Elle est déjà visible sur la page d’accueil.',
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Le téléversement a échoué. Vérifiez que le script SQL a bien été exécuté.',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleReset() {
    setSaving(true)
    setMessage(null)
    try {
      await saveSetting(PROMOTER_IMAGE_KEY, '')
      setCurrentUrl(null)
      setPreview(null)
      setFailed(false)
      if (inputRef.current) inputRef.current.value = ''
      setMessage({
        type: 'success',
        text: 'Image retirée : le visuel par défaut est de nouveau utilisé.',
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Échec de la réinitialisation.',
      })
    } finally {
      setSaving(false)
    }
  }

  const source = preview ?? currentUrl ?? PROMOTER.image
  const shownImage = failed ? PROMOTER.image : source

  return (
    <section className="promoter-admin" id="promoter-image">
      <header className="promoter-admin__head">
        <div>
          <h2>
            <ImagePlus size={18} /> Image du promoteur
          </h2>
          <p>
            Ajoutez ou remplacez la photo affichée dans la section «{' '}
            {PROMOTER.name} » de la page d’accueil.
          </p>
        </div>
        {currentUrl ? (
          <span className="badge badge--approved">Image personnalisée active</span>
        ) : (
          <span className="badge">Image par défaut</span>
        )}
      </header>

      {!isSupabaseConfigured && (
        <div className="alert alert--warning">
          <AlertCircle size={18} />
          <span>
            Connectez d’abord Supabase (fichier <code>.env</code>) pour pouvoir
            téléverser une image.
          </span>
        </div>
      )}

      <div className="promoter-admin__body">
        <div className="promoter-admin__preview">
          <img
            src={shownImage}
            alt="Aperçu de l’image du promoteur"
            onError={() => setFailed(true)}
          />
          {preview && (
            <span className="promoter-admin__tag">Aperçu — non enregistré</span>
          )}
        </div>

        <div className="promoter-admin__controls">
          <label className="promoter-admin__drop">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={!isSupabaseConfigured || saving}
            />
            <Upload size={18} />
            <span>{preview ? 'Changer d’image' : 'Choisir une image'}</span>
            <small>JPG, PNG ou WEBP · 5 Mo maximum</small>
          </label>

          <div className="promoter-admin__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => void handleUpload()}
              disabled={!preview || saving || !isSupabaseConfigured}
            >
              {saving ? (
                <>
                  <span className="spinner" /> Enregistrement…
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} /> Enregistrer l’image
                </>
              )}
            </button>

            {currentUrl && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => void handleReset()}
                disabled={saving}
              >
                <Trash2 size={17} /> Retirer l’image
              </button>
            )}
          </div>

          {message && (
            <div className={`alert alert--${message.type}`}>
              {message.type === 'success' ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
