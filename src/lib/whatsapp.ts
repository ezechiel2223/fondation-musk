import type { Application } from '../types'

/** Ne conserve que les chiffres d'un numéro (format requis par wa.me). */
export function normalizeWhatsappNumber(input: string): string {
  return (input ?? '').replace(/[^\d]/g, '')
}

/** Construit un lien wa.me prêt à ouvrir dans un nouvel onglet. */
export function buildWhatsappLink(number: string, message: string): string {
  const digits = normalizeWhatsappNumber(number)
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

/** Petite aide de mise en forme du montant pour les messages WhatsApp. */
function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}

/**
 * Message pré-rempli envoyé au candidat lorsqu'une décision est prise.
 * L'administrateur peut le relire/ajuster dans WhatsApp avant l'envoi.
 */
export function buildDecisionMessage(
  application: Application,
  decision: 'approved' | 'rejected',
): string {
  const firstName = application.full_name.split(' ')[0] || application.full_name
  const amount = formatAmount(application.amount_requested, application.currency)
  const ref = application.reference ? `🔖 Référence : ${application.reference}` : null

  if (decision === 'approved') {
    return [
      `Bonjour ${firstName},`,
      '',
      `Bonne nouvelle ! Votre demande de financement auprès de la Fondation Musk est ACCEPTÉE. ✅`,
      '',
      `📁 Projet : ${application.project_title}`,
      ...(ref ? [ref] : []),
      `💰 Montant accordé : ${amount}`,
      '',
      `Un conseiller de la Fondation va vous accompagner pour la suite des démarches. Pouvez-vous nous confirmer que vous êtes bien disponible sur ce numéro WhatsApp ?`,
      '',
      '— Fondation Musk International',
    ].join('\n')
  }

  return [
    `Bonjour ${firstName},`,
    '',
    `Nous vous remercions pour votre demande de financement auprès de la Fondation Musk et pour le temps consacré à votre dossier.`,
    '',
    `📁 Projet : ${application.project_title}`,
    ...(ref ? [ref] : []),
    '',
    `Après étude, nous ne sommes malheureusement pas en mesure de donner une suite favorable à ce dossier pour le moment. Nous vous encourageons à nous représenter votre projet enrichi lors d'un prochain cycle de sélection.`,
    '',
    'Nous vous souhaitons beaucoup de réussite.',
    '— Fondation Musk International',
  ].join('\n')
}
