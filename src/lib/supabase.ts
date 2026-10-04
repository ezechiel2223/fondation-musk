import { createClient } from '@supabase/supabase-js'
import type { Application, ApplicationPayload } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

/**
 * `true` dès que les identifiants Supabase sont fournis dans le `.env`.
 * L'interface s'en sert pour afficher un message de configuration clair
 * plutôt que de planter silencieusement.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: { persistSession: false },
    })
  : null

/** Nom de la table Supabase qui stocke les demandes. */
export const APPLICATIONS_TABLE = 'applications'

/**
 * Enregistre une nouvelle demande de financement.
 * Lance une erreur explicite si Supabase n'est pas configuré.
 */
const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/**
 * Génère une référence courte, lisible et sans caractères ambigus.
 * Exemple : « FM-7K4P2A ». Elle est stockée en base et communiquée au
 * candidat : l'administrateur peut ainsi retrouver le dossier en la cherchant.
 */
export function generateReference(): string {
  let code = ''

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint32Array(6)
    crypto.getRandomValues(bytes)
    for (let i = 0; i < 6; i += 1) {
      code += REFERENCE_ALPHABET[bytes[i] % REFERENCE_ALPHABET.length]
    }
  } else {
    for (let i = 0; i < 6; i += 1) {
      code += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)]
    }
  }

  return `FM-${code}`
}

/**
 * Enregistre une nouvelle demande de financement.
 * Renvoie la référence à afficher au candidat.
 *
 * Note : on n'utilise volontairement PAS `.select()` après l'insertion, afin
 * que l'enregistrement fonctionne même si la lecture publique est restreinte
 * par les règles RLS (mode sécurisé).
 */
export async function createApplication(
  payload: ApplicationPayload,
): Promise<{ reference: string }> {
  if (!supabase) {
    throw new Error(
      "Supabase n'est pas configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans le fichier .env.",
    )
  }

  const reference = generateReference()

  const { error } = await supabase.from(APPLICATIONS_TABLE).insert({
    ...payload,
    reference,
    status: 'pending',
  })

  if (error) throw error
  return { reference }
}

/** Normalise une ligne Supabase : `progress` est toujours un entier 0-100. */
function normalizeApplication(row: unknown): Application {
  const application = row as Application
  const value = Number(application.progress)
  return {
    ...application,
    progress: Number.isFinite(value)
      ? Math.min(100, Math.max(0, Math.round(value)))
      : 0,
  }
}

/** Récupère toutes les demandes, les plus récentes en premier. */
export async function fetchApplications(): Promise<Application[]> {
  if (!supabase) {
    throw new Error(
      "Supabase n'est pas configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans le fichier .env.",
    )
  }

  const { data, error } = await supabase
    .from(APPLICATIONS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(normalizeApplication)
}

/** Message lorsqu'aucune ligne n'a été modifiée (règles RLS trop strictes). */
export const NO_ROW_UPDATED =
  'Aucune ligne modifiée : les règles de sécurité (RLS) bloquent la mise à jour.'

/** Met à jour le statut d'une demande (pending / approved / rejected). */
export async function updateApplicationStatus(
  id: string,
  status: Application['status'],
  adminNote?: string,
): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré.")
  }

  const { error, count } = await supabase
    .from(APPLICATIONS_TABLE)
    .update({ status, admin_note: adminNote ?? null }, { count: 'exact' })
    .eq('id', id)

  if (error) throw error
  if (count === 0) throw new Error(NO_ROW_UPDATED)
}

/** Met à jour la barre de progression d'un dossier (0 à 100). */
export async function updateApplicationProgress(
  id: string,
  progress: number,
): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré.")
  }

  const safe = Math.max(0, Math.min(100, Math.round(progress)))

  const { error, count } = await supabase
    .from(APPLICATIONS_TABLE)
    .update({ progress: safe }, { count: 'exact' })
    .eq('id', id)

  if (error) throw error
  if (count === 0) throw new Error(NO_ROW_UPDATED)
}

/**
 * Dossier mis en avant sur la page d'accueil.
 *
 * 1. Le dernier dossier ACCEPTÉ (il « passe en étude »).
 * 2. À défaut, le dossier le plus avancé (progress > 0), afin que la barre de
 *    la page d'accueil suive toujours ce qui est réglé dans l'admin.
 * 3. Sinon `null` → la carte affiche un exemple de démonstration.
 */
export async function fetchFeaturedApplication(): Promise<Application | null> {
  if (!supabase) return null

  const approved = await supabase
    .from(APPLICATIONS_TABLE)
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!approved.error && approved.data) {
    return normalizeApplication(approved.data)
  }

  const advanced = await supabase
    .from(APPLICATIONS_TABLE)
    .select('*')
    .gt('progress', 0)
    .order('progress', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (advanced.error || !advanced.data) return null
  return normalizeApplication(advanced.data)
}
