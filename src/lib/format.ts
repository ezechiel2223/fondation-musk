/** Formate un montant en devise (par défaut FR). */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'fr-FR',
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}

/** Formate une date ISO en date lisible. */
export function formatDate(iso: string, locale = 'fr-FR'): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

/** Affiche un numéro WhatsApp de façon lisible (mise en forme légère). */
export function prettyWhatsapp(number: string): string {
  const digits = (number ?? '').replace(/[^\d]/g, '')
  if (digits.length < 8) return number
  // Regroupe par paquets de 2 après l'indicatif pour rester lisible.
  return '+' + digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
}

/** Étape du dossier correspondant au pourcentage d'avancement. */
export function progressStage(progress: number): string {
  if (progress >= 100) return 'Financement décaissé'
  if (progress >= 76) return 'Finalisation du dossier'
  if (progress >= 51) return 'Étude par le comité'
  if (progress >= 26) return 'Vérification du dossier'
  if (progress > 0) return 'Dossier reçu'
  return 'En attente de traitement'
}

/** Réduit un nom complet à « Prénom I. » pour protéger la vie privée. */
export function maskName(fullName: string): string {
  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'Candidat'
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`
}

/** Masque un numéro WhatsApp en ne laissant que l'indicatif. */
export function maskWhatsapp(number: string): string {
  const digits = (number ?? '').replace(/[^\d]/g, '')
  const prefix = digits.slice(0, 2)
  return prefix ? `+${prefix} •• •• •• ••` : '•• •• •• ••'
}
