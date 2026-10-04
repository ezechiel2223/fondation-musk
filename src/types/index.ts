// ---------------------------------------------------------------------------
// Types de la Fondation Musk
// ---------------------------------------------------------------------------

/** Statut de traitement d'une demande de financement. */
export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

/** Ligne complète telle que stockée dans la table Supabase `applications`. */
export interface Application {
  id: string
  /** Référence courte communiquée au candidat, ex. « FM-7K4P2A ». */
  reference: string | null
  created_at: string
  full_name: string
  email: string
  phone: string | null
  whatsapp: string
  country: string
  city: string | null
  project_title: string
  project_sector: string
  project_description: string
  amount_requested: number
  currency: string
  timeline: string | null
  status: ApplicationStatus
  /** Avancement du dossier en pourcentage (0 à 100), réglé depuis l'admin. */
  progress: number
  admin_note: string | null
}

/** Données envoyées par le formulaire public (sans les champs gérés côté serveur). */
export interface ApplicationPayload {
  full_name: string
  email: string
  phone: string
  whatsapp: string
  country: string
  city: string
  project_title: string
  project_sector: string
  project_description: string
  amount_requested: number
  currency: string
  timeline: string
}
