/**
 * Accès léger à l'espace administrateur.
 *
 * L'entrée se fait uniquement par URL (`/admin/login`) : aucun lien vers
 * l'admin n'est exposé dans la navigation publique.
 */
const SESSION_KEY = 'fm-admin-unlocked'

export const ADMIN_PASSCODE =
  import.meta.env.VITE_ADMIN_PASSCODE?.trim() || 'fondation-musk-2026'

/** `true` si l'administrateur s'est déjà authentifié pour cette session. */
export function isAdminUnlocked(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'ok'
}

/** Marque la session comme authentifiée. */
export function unlockAdmin(): void {
  sessionStorage.setItem(SESSION_KEY, 'ok')
}

/** Ferme la session administrateur. */
export function lockAdmin(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

/** Vérifie le code d'accès saisi. */
export function checkPasscode(value: string): boolean {
  return value.trim() === ADMIN_PASSCODE
}
