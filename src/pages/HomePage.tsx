import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  GraduationCap,
  Globe2,
  HeartHandshake,
  MessageCircle,
  Rocket,
  type LucideIcon,
} from 'lucide-react'
import {
  FAQ,
  PILLARS,
  SECTORS,
  SITE,
  STATS,
  STEPS,
  TESTIMONIALS,
} from '../data/content'
import { HeroDossier } from '../components/HeroDossier'
import { OngoingRequests } from '../components/OngoingRequests'
import { Promoter } from '../components/Promoter'
import { Reveal } from '../components/Reveal'
import './HomePage.css'

const PILLAR_ICONS: Record<string, LucideIcon> = {
  Rocket,
  HeartHandshake,
  GraduationCap,
  Globe2,
}

const GRANT_TIERS = [
  {
    name: 'Amorçage',
    range: '1 000 $ — 25 000 $',
    text: 'Pour lancer une première version, tester le marché et financer les premiers coûts.',
  },
  {
    name: 'Croissance',
    range: '25 000 $ — 250 000 $',
    text: 'Pour structurer une équipe, industrialiser et accélérer la traction.',
  },
  {
    name: 'Passage à l’échelle',
    range: '250 000 $ — 1 000 000 $',
    text: 'Pour déployer sur de nouveaux marchés en France et aux États-Unis.',
  },
  {
    name: 'Grand impact',
    range: '1 000 000 $ — 5 000 000 $',
    text: 'Pour les projets à fort potentiel humain, scientifique ou environnemental.',
  },
]

export function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <>
      {/* ============================================================= Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <Reveal>
              <span className="eyebrow">Fondation internationale · France ↔ États-Unis</span>
            </Reveal>
            <Reveal delay={70}>
              <h1 className="hero__title">
                Nous finançons les projets qui font{' '}
                <span className="grad-text">avancer l’humanité</span>.
              </h1>
            </Reveal>
            <Reveal delay={130}>
              <p className="hero__lead">
                La Fondation Musk soutient les entrepreneurs, chercheurs et
                créateurs entre la France et les États-Unis. Décrivez votre
                projet, indiquez le montant dont vous avez besoin, et nous vous
                répondons directement sur WhatsApp.
              </p>
            </Reveal>
            <Reveal delay={190}>
              <div className="hero__actions">
                <Link to="/demande" className="btn btn--primary btn--lg">
                  Déposer ma demande
                  <ArrowRight size={18} />
                </Link>
                <Link to="/#mission" className="btn btn--ghost btn--lg">
                  Découvrir notre mission
                </Link>
              </div>
            </Reveal>
            <Reveal delay={250}>
              <ul className="hero__trust">
                <li>
                  <Check size={16} /> 100 % gratuit, sans frais de dossier
                </li>
                <li>
                  <Check size={16} /> Réponse sous 7 à 21 jours
                </li>
                <li>
                  <Check size={16} /> Contact direct par WhatsApp
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal delay={150} className="hero__visual">
            <HeroDossier />
          </Reveal>
        </div>
      </section>

      {/* ============================================================ Stats */}
      <section className="stats-band">
        <div className="container stats-band__grid">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 70}>
              <div className="stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =============================================== Dossiers en cours */}
      <OngoingRequests />

      {/* ========================================================== Mission */}
      <section className="section" id="mission">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Notre mission</span>
            <h2 className="section-title">
              Une fondation au service de <span className="grad-text">l’humain</span>
            </h2>
            <p className="section-lead">
              Née d’un pont entre Paris et la Silicon Valley, la Fondation Musk
              finance les idées capables d’améliorer concrètement la vie de
              millions de personnes.
            </p>
          </Reveal>

          <div className="pillars">
            {PILLARS.map((pillar, index) => {
              const Icon = PILLAR_ICONS[pillar.icon] ?? Rocket
              return (
                <Reveal key={pillar.title} delay={index * 80}>
                  <article className="card pillar">
                    <span className="pillar__icon">
                      <Icon size={24} />
                    </span>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.text}</p>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== Promoteur */}
      <Promoter />

      {/* ======================================================= Financement */}
      <section className="section finance" id="financement">
        <div className="container finance__inner">
          <Reveal className="finance__intro">
            <span className="eyebrow">Combien pouvez-vous obtenir ?</span>
            <h2 className="section-title">
              De <span className="gold-text">1 000 $</span> à 5 000 000 $ pour
              concrétiser votre projet
            </h2>
            <p className="section-lead finance__lead">
              Vous n’avez pas à deviner le bon montant : indiquez simplement ce
              dont vous avez besoin pour démarrer. Notre comité ajustera ensuite
              avec vous.
            </p>
            <ul className="finance__checklist">
              <li>
                <Check size={18} /> Dons d’amorçage sans remboursement exigé
              </li>
              <li>
                <Check size={18} /> Étude gratuite et strictement confidentielle
              </li>
              <li>
                <Check size={18} /> Décision communiquée par WhatsApp
              </li>
            </ul>
            <Link to="/demande" className="btn btn--primary btn--lg">
              Estimer mon financement
              <ArrowUpRight size={18} />
            </Link>
          </Reveal>

          <div className="finance__tiers">
            {GRANT_TIERS.map((tier, index) => (
              <Reveal key={tier.name} delay={index * 70}>
                <article className="tier">
                  <div className="tier__head">
                    <h3>{tier.name}</h3>
                    <span className="tier__range">{tier.range}</span>
                  </div>
                  <p>{tier.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="container">
          <Reveal className="finance__sectors">
            <span className="faint">Secteurs financés</span>
            <ul>
              {SECTORS.map((sector) => (
                <li key={sector.value}>{sector.label}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ======================================================== Processus */}
      <section className="section process" id="processus">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Comment ça marche</span>
            <h2 className="section-title">Votre financement en 4 étapes</h2>
            <p className="section-lead">
              Un parcours simple, rapide et transparent — jusqu’au versement des
              fonds.
            </p>
          </Reveal>

          <div className="steps">
            {STEPS.map((step, index) => (
              <Reveal key={step.index} delay={index * 80}>
                <article className="step">
                  <span className="step__index">{step.index}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== Témoignages */}
      <section className="section" id="temoignages">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Ils ont été financés</span>
            <h2 className="section-title">Des projets, des vies qui changent</h2>
          </Reveal>

          <div className="testimonials">
            {TESTIMONIALS.map((item, index) => (
              <Reveal key={item.name} delay={index * 80}>
                <figure className="card testimonial">
                  <blockquote lang={item.lang}>“{item.quote}”</blockquote>
                  <figcaption>
                    <span className="testimonial__avatar" aria-hidden="true">
                      {item.flag}
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      <em>{item.role}</em>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== CTA */}
      <section className="section section--tight">
        <div className="container">
          <Reveal>
            <div className="cta">
              <div className="cta__content">
                <h2>Prêt à donner vie à votre projet ?</h2>
                <p>
                  Déposez votre demande en moins de 5 minutes. Nous vous répondons
                  directement sur le numéro WhatsApp que vous nous communiquerez.
                </p>
              </div>
              <div className="cta__actions">
                <Link to="/demande" className="btn btn--gold btn--lg">
                  Déposer ma demande
                  <ArrowRight size={18} />
                </Link>
                <a
                  href={SITE.whatsappPublicLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--outline btn--lg"
                >
                  <MessageCircle size={18} /> Écrire sur WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================== FAQ */}
      <section className="section" id="faq">
        <div className="container faq__inner">
          <Reveal className="section-head section-head--left faq__head">
            <span className="eyebrow">Questions fréquentes</span>
            <h2 className="section-title">Tout ce qu’il faut savoir</h2>
            <p className="section-lead">
              Une autre question ? Écrivez-nous sur WhatsApp, nous répondons
              rapidement.
            </p>
            <a
              href={SITE.whatsappPublicLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn--ghost"
            >
              <MessageCircle size={18} /> Poser ma question
            </a>
          </Reveal>

          <div className="faq__list">
            {FAQ.map((item, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  className={`faq__item${isOpen ? ' is-open' : ''}`}
                  key={item.question}
                >
                  <button
                    type="button"
                    className="faq__question"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <ChevronDown size={20} />
                  </button>
                  <div className="faq__answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}



