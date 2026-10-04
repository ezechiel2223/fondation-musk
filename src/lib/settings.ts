import { supabase } from './supabase'

/** Table clé/valeur des réglages du site. */
export const SETTINGS_TABLE = 'site_settings'

/** Bucket Supabase Storage qui accueille les images du site. */
export const MEDIA_BUCKET = 'media'

/** Clé de réglage qui contient l'URL publique de la photo du promoteur. */
export const PROMOTER_IMAGE_KEY = 'promoter_image_url'

function requireClient() {
  if (!supabase) {
    throw new Error(
      "Supabase n'est pas configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans le fichier .env.",
    )
  }
  return supabase
}

/** Récupère tous les réglages sous forme { clé: valeur }. */
export async function fetchSettings(): Promise<Record<string, string>> {
  if (!supabase) return {}

  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .select('key, value')

  if (error) throw error

  const settings: Record<string, string> = {}
  for (const row of (data ?? []) as { key: string; value: string | null }[]) {
    if (row.value) settings[row.key] = row.value
  }
  return settings
}

/** Récupère un réglage précis (null s'il n'existe pas). */
export async function fetchSetting(key: string): Promise<string | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .select('value')
    .eq('key', key)
    .maybeSingle()

  if (error) throw error
  return (data as { value: string | null } | null)?.value ?? null
}

/** Crée ou met à jour un réglage. */
export async function saveSetting(key: string, value: string): Promise<void> {
  const client = requireClient()

  const { error } = await client
    .from(SETTINGS_TABLE)
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )

  if (error) throw error
}

/** Vérifie que le fichier est bien une image et reste raisonnable en taille. */
export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Le fichier doit être une image (JPG, PNG, WEBP…).'
  }
  if (file.size > 5 * 1024 * 1024) {
    return "L'image ne doit pas dépasser 5 Mo."
  }
  return null
}

/**
 * Envoie une image dans le bucket `media` et renvoie son URL publique.
 */
export async function uploadPromoterImage(file: File): Promise<string> {
  const client = requireClient()

  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `promoteur-${Date.now()}.${extension}`

  const { error } = await client.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || 'image/jpeg',
  })

  if (error) throw error

  const { data } = client.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
