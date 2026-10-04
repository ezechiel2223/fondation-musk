// ---------------------------------------------------------------------------
// Contenu éditorial du site — Fondation Musk
// ---------------------------------------------------------------------------

export const SITE = {
  name: 'Fondation Musk',
  shortName: 'Fondation Musk',
  // Slogan officiel de la Fondation.
  tagline: "Financer l'avenir de l'humanité",
  baseline:
    'Entre la France et les États-Unis, nous finançons les projets qui font avancer l’humanité.',
  email: 'contact@fondation-musk.org',
  whatsappPublic: '+1 859 443 0352',
  whatsappPublicLink: 'https://wa.me/18594430352',
}

// ---------------------------------------------------------------------------
// 📸 EMPLACEMENT DE L'IMAGE DU PROMOTEUR
// ---------------------------------------------------------------------------
// MODE D'EMPLOI (2 possibilités) :
//
//   1. Le plus simple : déposez votre photo dans le dossier  public/images/
//      en la nommant exactement  promoteur.jpg  (ou .png / .webp) PUIS
//      changez la ligne `image:` ci-dessous en conséquence.
//
//   2. Ou remplacez directement le fichier d'attente
//      public/images/promoteur.svg  par votre propre image.
//
// Tant qu'aucune image n'est trouvée, un joli emplacement d'attente
// s'affiche automatiquement sur le site (rien ne casse).
// ---------------------------------------------------------------------------
export const PROMOTER = {
  image: '/images/promoteur.svg',
  name: 'Elon Musk',
  role: 'Fondateur & Président · Fondation Musk',
  quote:
    "Nous finançons les idées qui font avancer l’humanité — de Paris à San Francisco.",
  bio: "Convaincu que les meilleures solutions naissent de la rencontre des talents et des cultures, Elon Musk a créé la Fondation Musk pour donner à chaque porteur de projet les moyens de transformer son ambition en impact réel.",
}

export interface NavItem {
  label: string
  to: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', to: '/' },
  { label: 'Mission', to: '/#mission' },
  { label: 'Processus', to: '/#processus' },
  { label: 'Témoignages', to: '/#temoignages' },
  { label: 'FAQ', to: '/#faq' },
]

export interface StatItem {
  value: string
  label: string
}

export const STATS: StatItem[] = [
  { value: '2,4 Md$', label: 'Investis dans des projets à impact' },
  { value: '1 280+', label: 'Projets financés depuis 2016' },
  { value: '37', label: 'Pays accompagnés' },
  { value: '98 %', label: "De candidats satisfaits de l'accompagnement" },
]

export interface Pillar {
  icon: string
  title: string
  text: string
}

export const PILLARS: Pillar[] = [
  {
    icon: 'Rocket',
    title: 'Impact technologique',
    text: 'Énergies propres, spatial, intelligence artificielle, santé. Nous finançons les technologies qui repoussent les limites du possible.',
  },
  {
    icon: 'HeartHandshake',
    title: 'Solidarité franco-américaine',
    text: 'Une passerelle entre Paris et San Francisco pour connecter entrepreneurs, chercheurs et philanthropes des deux continents.',
  },
  {
    icon: 'GraduationCap',
    title: 'Éducation & talents',
    text: "Bourses et programmes pour rendre les meilleures formations accessibles, quel que soit l'endroit où l'on grandit.",
  },
  {
    icon: 'Globe2',
    title: 'Impact global',
    text: "Chaque euro investi est suivi et mesuré : transparence totale sur l'usage des fonds et les résultats obtenus.",
  },
]

export interface Step {
  index: string
  title: string
  text: string
}

export const STEPS: Step[] = [
  {
    index: '01',
    title: 'Déposez votre demande',
    text: 'Remplissez le formulaire en moins de 5 minutes : montant souhaité, description de votre projet et coordonnées de contact, dont votre numéro WhatsApp.',
  },
  {
    index: '02',
    title: 'Étude de votre dossier',
    text: 'Notre comité franco-américain analyse votre projet sous 7 à 21 jours selon la nature de la demande et le montant sollicité.',
  },
  {
    index: '03',
    title: 'Décision & contact WhatsApp',
    text: "Quelle que soit la décision, nous vous contactons directement sur le numéro WhatsApp que vous avez fourni pour vous l'annoncer.",
  },
  {
    index: '04',
    title: 'Décaissement & suivi',
    text: 'Si votre projet est accepté, nous mettons en place un calendrier de versement et un accompagnement par un conseiller dédié.',
  },
]

export interface Option {
  value: string
  label: string
}

export const SECTORS: Option[] = [
  { value: 'technologie', label: 'Technologie & Intelligence artificielle' },
  { value: 'energie', label: 'Énergie propre & Climat' },
  { value: 'sante', label: 'Santé & Biotechnologies' },
  { value: 'education', label: 'Éducation & Formation' },
  { value: 'agriculture', label: 'Agriculture & Alimentation durable' },
  { value: 'mobilite', label: 'Mobilité & Spatial' },
  { value: 'social', label: 'Solidarité & Inclusion sociale' },
  { value: 'commerce', label: 'Commerce & Entrepreneuriat' },
  { value: 'autre', label: 'Autre' },
]

export const COUNTRIES: Option[] = [
  { value: 'France', label: '🇫🇷 France' },
  { value: 'États-Unis', label: '🇺🇸 États-Unis' },
  { value: 'Canada', label: '🇨🇦 Canada' },
  { value: 'Autre', label: '🌍 Autre pays' },
]

export const CURRENCIES: string[] = ['USD', 'EUR']

export const TIMELINES: Option[] = [
  { value: 'immediat', label: 'Le plus tôt possible' },
  { value: '1-3mois', label: 'Dans 1 à 3 mois' },
  { value: '3-6mois', label: 'Dans 3 à 6 mois' },
  { value: '6mois-plus', label: 'Dans plus de 6 mois' },
]

export interface FaqItem {
  question: string
  answer: string
}

export const FAQ: FaqItem[] = [
  {
    question: 'Qui peut déposer une demande de financement ?',
    answer:
      'Toute personne portant un projet à impact : entrepreneur, étudiant, chercheur, association ou PME. Nous accueillons les dossiers depuis la France, les États-Unis et plus de 35 autres pays.',
  },
  {
    question: 'Quel montant puis-je demander ?',
    answer:
      "De 1 000 $ à 5 000 000 $ selon la maturité et l'ambition du projet. Indiquez simplement le montant dont vous avez réellement besoin pour lancer ou accélérer votre projet.",
  },
  {
    question: 'Pourquoi demandez-vous mon numéro WhatsApp ?',
    answer:
      "C'est notre canal privilégié pour vous répondre rapidement, où que vous soyez dans le monde. Nous vous y informons de la décision concernant votre dossier et vous accompagnons dans les démarches.",
  },
  {
    question: 'La demande est-elle payante ?',
    answer:
      "Non. Le dépôt de dossier et l'étude sont entièrement gratuits. La Fondation Musk ne demande jamais de frais de dossier ni de paiement préalable.",
  },
  {
    question: 'Sous combien de temps serai-je contacté ?',
    answer:
      'Vous recevez un accusé de réception immédiat, puis une décision sous 7 à 21 jours ouvrés selon la complexité du dossier.',
  },
]

export interface Testimonial {
  name: string
  role: string
  quote: string
  flag: string
  /** Français pour les témoins français, anglais pour les témoins américains. */
  lang: 'fr' | 'en'
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Camille Deschamps',
    role: 'Fondatrice, SolarLeaf · Lyon, France',
    quote:
      "En trois semaines mon dossier était accepté et j'ai été contactée directement sur WhatsApp. Un accompagnement humain et rapide, du début à la fin.",
    flag: '🇫🇷',
    lang: 'fr',
  },
  {
    name: 'Marcus Bell',
    role: 'CEO, NeuraRehab · Austin, États-Unis',
    quote:
      'The Foundation believed in our AI rehabilitation project when nobody else would. Their follow-up on the funds is refreshingly transparent.',
    flag: '🇺🇸',
    lang: 'en',
  },
  {
    name: 'Aïcha Diallo',
    role: 'Co-fondatrice, AgriNext · Bordeaux, France',
    quote:
      "Le formulaire était simple et la réponse très claire. On m'a annoncé la bonne nouvelle par message, avec chaque étape expliquée.",
    flag: '🇫🇷',
    lang: 'fr',
  },
  {
    name: 'Rachel Nguyen',
    role: 'Founder, BrightGrid · San Francisco, États-Unis',
    quote:
      'We applied on a Sunday and heard back in eleven days. The WhatsApp follow-up made the whole process feel personal and fast.',
    flag: '🇺🇸',
    lang: 'en',
  },
  {
    name: 'Julien Mercier',
    role: 'Directeur technique, MedLink · Toulouse, France',
    quote:
      'Un financement obtenu en un temps record pour notre plateforme de télémédecine. Le comité pose les bonnes questions, sans bureaucratie inutile.',
    flag: '🇫🇷',
    lang: 'fr',
  },
  {
    name: 'Emily Carter',
    role: 'Co-founder, AquaLoop · Seattle, États-Unis',
    quote:
      'The grant let us deploy our water-recycling pilot in three schools. Being contacted directly on WhatsApp made everything feel effortless.',
    flag: '🇺🇸',
    lang: 'en',
  },
  {
    name: 'Sophie Lambert',
    role: 'Directrice, École du Numérique · Lille, France',
    quote:
      "Grâce à la Fondation, 400 jeunes ont accès à une formation gratuite au code. Le suivi des fonds est d'une rigueur exemplaire.",
    flag: '🇫🇷',
    lang: 'fr',
  },
  {
    name: 'David Coleman',
    role: 'Director, Rural Health AI · Denver, États-Unis',
    quote:
      'Our rural diagnostics project would never have launched without them. Clear criteria, quick decisions, and a real partnership afterwards.',
    flag: '🇺🇸',
    lang: 'en',
  },
  {
    name: 'Karim Bensalah',
    role: 'Fondateur, Mobility+ · Marseille, France',
    quote:
      "J'avais déposé trois dossiers ailleurs sans réponse. Ici tout est transparent : un accusé de réception immédiat et une décision en quinze jours.",
    flag: '🇫🇷',
    lang: 'fr',
  },
  {
    name: 'James Okafor',
    role: 'CEO, LearnSphere · Chicago, États-Unis',
    quote:
      'They funded our adaptive-learning platform for underserved schools. The whole process, from application to wire, took under a month.',
    flag: '🇺🇸',
    lang: 'en',
  },
  {
    name: 'Léa Fontaine',
    role: 'Chercheuse, Institut Océan · Nantes, France',
    quote:
      "Notre programme de dépollution marine a enfin pu démarrer. Être contactée par WhatsApp plutôt que par un courrier impersonnel change tout.",
    flag: '🇫🇷',
    lang: 'fr',
  },
  {
    name: 'Hannah Pierce',
    role: 'Founder, SolarSky · Phoenix, États-Unis',
    quote:
      'We received the first tranche three weeks after approval. Honest, human, and surprisingly fast for a foundation of this size.',
    flag: '🇺🇸',
    lang: 'en',
  },
]


export interface OngoingRequest {
  ref: string
  project: string
  sector: string
  city: string
  country: string
  flag: string
  amount: number
  currency: string
  stage: string
  tone: 'study' | 'committee' | 'review'
}

/**
 * Aperçu anonymisé de dossiers actuellement à l'étude.
 * Alimente le bandeau défilant de la page d'accueil.
 */
export const ONGOING_REQUESTS: OngoingRequest[] = [
  {
    ref: 'FM-8A21',
    project: 'SolarLeaf',
    sector: 'Énergie propre',
    city: 'Lyon',
    country: 'France',
    flag: '🇫🇷',
    amount: 85000,
    currency: 'USD',
    stage: 'En étude',
    tone: 'study',
  },
  {
    ref: 'FM-3C07',
    project: 'NeuraRehab',
    sector: 'Santé & IA',
    city: 'Austin',
    country: 'États-Unis',
    flag: '🇺🇸',
    amount: 240000,
    currency: 'USD',
    stage: 'Comité',
    tone: 'committee',
  },
  {
    ref: 'FM-9F14',
    project: 'AgriNext',
    sector: 'Agriculture',
    city: 'Bordeaux',
    country: 'France',
    flag: '🇫🇷',
    amount: 42500,
    currency: 'USD',
    stage: 'Vérification',
    tone: 'review',
  },
  {
    ref: 'FM-1D62',
    project: 'BrightGrid',
    sector: 'Énergie propre',
    city: 'San Francisco',
    country: 'États-Unis',
    flag: '🇺🇸',
    amount: 310000,
    currency: 'USD',
    stage: 'En étude',
    tone: 'study',
  },
  {
    ref: 'FM-5B93',
    project: 'MedLink',
    sector: 'Santé',
    city: 'Toulouse',
    country: 'France',
    flag: '🇫🇷',
    amount: 120000,
    currency: 'USD',
    stage: 'Comité',
    tone: 'committee',
  },
  {
    ref: 'FM-7E30',
    project: 'LearnSphere',
    sector: 'Éducation',
    city: 'Chicago',
    country: 'États-Unis',
    flag: '🇺🇸',
    amount: 68000,
    currency: 'USD',
    stage: 'En étude',
    tone: 'study',
  },
  {
    ref: 'FM-2A48',
    project: 'AquaLoop',
    sector: 'Climat',
    city: 'Seattle',
    country: 'États-Unis',
    flag: '🇺🇸',
    amount: 175000,
    currency: 'USD',
    stage: 'Vérification',
    tone: 'review',
  },
  {
    ref: 'FM-6C11',
    project: 'Mobility+',
    sector: 'Mobilité',
    city: 'Marseille',
    country: 'France',
    flag: '🇫🇷',
    amount: 95000,
    currency: 'USD',
    stage: 'En étude',
    tone: 'study',
  },
  {
    ref: 'FM-4G77',
    project: 'Institut Océan',
    sector: 'Climat',
    city: 'Nantes',
    country: 'France',
    flag: '🇫🇷',
    amount: 260000,
    currency: 'USD',
    stage: 'Comité',
    tone: 'committee',
  },
  {
    ref: 'FM-8H25',
    project: 'SolarSky',
    sector: 'Énergie propre',
    city: 'Phoenix',
    country: 'États-Unis',
    flag: '🇺🇸',
    amount: 410000,
    currency: 'USD',
    stage: 'En étude',
    tone: 'study',
  },
]

export const MIN_AMOUNT = 1000
export const MAX_AMOUNT = 5000000
