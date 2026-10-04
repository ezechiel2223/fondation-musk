# Fondation Musk — Plateforme de financement

Plateforme philanthropique **France ↔ États-Unis** qui finance des projets à
impact humain. Les candidats déposent une demande (montant souhaité + leurs
coordonnées, dont leur **numéro WhatsApp**) ; la Fondation étudie le dossier
depuis un espace administrateur et répond au candidat **sur WhatsApp**.

## Stack

- **React 19** + **Vite** + **TypeScript**
- **React Router 7** (pages `/`, `/demande`, `/admin`)
- **Supabase** (`@supabase/supabase-js`) pour la base de données
- **lucide-react** pour les icônes
- CSS maison (aucun framework UI)

## Démarrage

```bash
npm install
cp .env.example .env   # puis renseignez vos clés Supabase
npm run dev
```

## Configuration Supabase

1. Créez un compte puis un projet sur [supabase.com](https://supabase.com).
2. Ouvrez **SQL Editor**, collez tout le contenu de `supabase/schema.sql` et
   cliquez sur **Run**. Cela crée la table `public.applications` et les règles
   d'accès. (Le script peut être relancé sans risque.)
3. Ouvrez **Project Settings → API Keys** et copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - la clé **anon / publishable** → `VITE_SUPABASE_ANON_KEY`
4. Collez ces deux valeurs dans le fichier `.env` (déjà présent à la racine) :

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_ADMIN_PASSCODE=un-code-secret
```

5. Redémarrez le serveur (`Ctrl + C` puis `npm run dev`).

Chaque demande soumise est enregistrée dans la table `public.applications`.
Vous pouvez la consulter directement dans **Supabase → Table Editor → applications**,
ou depuis l'espace administrateur `/admin/login`.

## Image du promoteur

La photo affichée dans la section « Le promoteur » se règle en **un seul endroit** :
`src/data/content.ts` → constante `PROMOTER`.

```ts
export const PROMOTER = {
  image: '/images/promoteur.svg', // <- chemin de votre image
  name: 'Nom du promoteur',
  role: 'Fondateur & Président · Fondation Musk',
  quote: '...',
  bio: '...',
}
```

Pour la remplacer :

1. Déposez votre fichier dans le dossier `public/images/`
   (ex. `public/images/promoteur.jpg`).
2. Mettez à jour la ligne `image:` → `'/images/promoteur.jpg'`.

Tant qu'aucune image n'est trouvée, un emplacement d'attente élégant s'affiche
automatiquement sur le site.

## Espace administrateur

L'accès se fait **uniquement par URL**, aucun lien n'est exposé sur le site :

> **`/admin/login`**

Entrez le code défini par `VITE_ADMIN_PASSCODE`. Vous arrivez alors sur le
tableau de bord `/admin` (toute visite directe de `/admin` sans être connecté
redirige vers `/admin/login`). Vous pouvez alors :

- consulter, filtrer et rechercher toutes les demandes ;
- **accepter** ou **refuser** un dossier (le statut est mis à jour dans Supabase) ;
- **régler la barre de progression** de chaque dossier : curseur de 0 à 100 %
  ou raccourcis *Reçu / Vérification / Comité / Finalisation / Décaissé* ;
- gérer la **photo du promoteur** (panneau en bas de page) ;
- ouvrir WhatsApp pré-rempli pour annoncer la décision :
  `https://wa.me/<numéro>?text=<message>`.

### Avancement d'un dossier

Chaque demande possède une colonne `progress` (0 à 100). Accepter un dossier le
fait **automatiquement passer au stade « en étude »** : si l'avancement était à
0 %, il démarre à 25 %. L'administrateur ajuste ensuite le pourcentage, et la
barre se met à jour partout.

### Carte « Dossier de financement » de la page d'accueil

La carte du hero (`src/components/HeroDossier.tsx`) est **dynamique** : elle
affiche automatiquement le **dernier dossier accepté** (avec son pourcentage
d'avancement et l'étape correspondante). Les données personnelles sont
anonymisées (prénom + initiale, numéro WhatsApp masqué). Tant qu'aucun dossier
n'est accepté, un exemple de démonstration est affiché.

> **Sécurité** : le schéma fournit par défaut un mode *prototype* (accès anon en
> lecture/écriture) pour que tout fonctionne immédiatement. Pour la production,
> activez le mode sécurisé décrit en bas de `supabase/schema.sql` et remplacez le
> code d'accès par **Supabase Auth**.

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Vérification TypeScript + build de production |
| `npm run preview` | Prévisualiser le build |
| `npm run lint` | Linter (oxlint) |

## Structure

```
src/
  components/   Navbar, Footer, Logo, Reveal, ScrollToTop,
                OngoingRequests, Promoter, PromoterImageManager
  layouts/      SiteLayout (navbar + footer + contenu)
  pages/        HomePage, ApplyPage, AdminPage, AdminLoginPage, NotFoundPage
  lib/          supabase.ts, settings.ts, whatsapp.ts, format.ts, adminAuth.ts
  data/         content.ts (contenu éditorial, WhatsApp, promoteur, slogan)
  types/        types des demandes
supabase/
  schema.sql    tables, règles RLS et bucket de stockage

## Déploiement (GitHub + Vercel)

### 1. Envoyer le code sur GitHub

```bash
git init
git add .
git commit -m "Fondation Musk — site complet"
git branch -M main
git remote add origin https://github.com/VOTRE-NOM/fondation-musk.git
git push -u origin main
```

### 2. Importer le projet sur Vercel

1. [vercel.com](https://vercel.com) → *Add New…* → *Project*.
2. *Import Git Repository* → choisissez `fondation-musk`.
3. Vercel détecte Vite automatiquement. Laissez :
   - **Framework Preset** : `Vite`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
4. **Avant de cliquer sur Deploy**, ouvrez *Environment Variables* et ajoutez :

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |
| `VITE_ADMIN_PASSCODE` | votre code secret |

5. Cliquez **Deploy**. Le site est en ligne en ~1 minute.

Le fichier `vercel.json` fourni redirige toutes les URL vers `index.html`,
ce qui permet d'ouvrir directement `/admin/login` ou `/demande` (sinon Vercel
renverrait une erreur 404 au rechargement).

> Après un changement de variable d'environnement sur Vercel, relancez un
> déploiement (*Deployments → … → Redeploy*) pour qu'elle soit prise en compte.

public/
  images/       images du site (photo du promoteur par défaut)
vercel.json     redirection SPA (indispensable pour Vercel)
```
