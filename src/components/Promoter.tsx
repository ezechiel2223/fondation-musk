import { useEffect, useState } from 'react'
import { ImagePlus, Quote, Sparkles } from 'lucide-react'
import { PROMOTER } from '../data/content'
import { isSupabaseConfigured } from '../lib/supabase'
import { PROMOTER_IMAGE_KEY, fetchSetting } from '../lib/settings'
import { Reveal } from './Reveal'
import './Promoter.css'

/**
 * Section « Le promoteur » avec emplacement photo.
 *
 * L'image affichée est, dans l'ordre :
 *   1. celle téléversée depuis l'espace admin (stockée dans Supabase Storage) ;
 *   2. sinon celle définie dans `PROMOTER.image` (src/data/content.ts) ;
 *   3. sinon un emplacement d'attente élégant.
 */
export function Promoter() {
  const [imageUrl, setImageUrl] = useState(PROMOTER.image)
  const [imageOk, setImageOk] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true
    fetchSetting(PROMOTER_IMAGE_KEY)
      .then((url) => {
        if (active && url) {
          setImageUrl(url)
          setImageOk(true)
        }
      })
      .catch(() => {
        /* silencieux : on conserve l'image par défaut */
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="section promoter" id="promoteur">
      <div className="container promoter__inner">
        <Reveal className="promoter__media">
          <div className="promoter__frame">
            {imageOk ? (
              <img
                src={imageUrl}
                alt={PROMOTER.name}
                className="promoter__img"
                loading="lazy"
                onError={() => setImageOk(false)}
              />
            ) : (
              <div className="promoter__placeholder">
                <ImagePlus size={30} />
                <strong>Emplacement de l’image</strong>
                <span>
                  Déposez votre photo dans le dossier <code>public/images/</code>{' '}
                  puis indiquez son nom dans <code>src/data/content.ts</code>.
                </span>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal className="promoter__content" delay={90}>
          <span className="eyebrow">Le promoteur</span>
          <h2 className="section-title">{PROMOTER.name}</h2>
          <p className="promoter__role">{PROMOTER.role}</p>

          <blockquote className="promoter__quote">
            <Quote size={22} />
            <p>“{PROMOTER.quote}”</p>
          </blockquote>

          <p className="promoter__bio">{PROMOTER.bio}</p>

          <span className="promoter__sign">
            <Sparkles size={16} /> Fondation Musk International
          </span>
        </Reveal>
      </div>
    </section>
  )
}
