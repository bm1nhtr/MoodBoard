# Mood Board — Journal émotionnel personnel

Tableau de bord quotidien pour noter ses humeurs et souvenirs visuels.
Chaque jour : un mood, des cadres image ou texte, un historique sous forme de heatmap.

**Stack** : React 19 + TypeScript + Vite (frontend) · Express 5 + TypeScript + MongoDB Atlas (backend) · Google OAuth 2.0

---

## Démarrage rapide

> Prérequis : Node.js 20.19+ (ou 22.12+), un cluster MongoDB Atlas, des credentials Google OAuth.

```bash
# 1. Cloner
git clone <url-du-repo>
cd MoodBoard

# 2. Backend
cd full-stack-app/backend
npm install
cp .env.example .env        # puis remplir MONGODB_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET

npm run dev                 # → http://localhost:3000

# 3. Frontend (nouveau terminal)
cd full-stack-app/frontend
npm install
npm run dev                 # → http://localhost:5173
```

Ouvrir **http://localhost:5173** — se connecter avec Google — c'est prêt.

> Besoin d'aide pour configurer les variables ? Voir la section [Variables d'environnement](#variables-denvironnement).

---

## Prérequis

| Outil | Version minimale |
|---|---|
| [Node.js](https://nodejs.org/) | 20.19+ (ou 22.12+) |
| [npm](https://www.npmjs.com/) | 9+ |
| Compte [Google Cloud](https://console.cloud.google.com/) | Pour OAuth |
| Cluster [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Gratuit (M0) |

---

## Installation

### 1. Cloner le repo

```bash
git clone <url-du-repo>
cd MoodBoard
```

### 2. Backend

```bash
cd full-stack-app/backend
npm install
cp .env.example .env
```

Ouvrir `.env` et renseigner toutes les variables (voir section ci-dessous).

```bash
npm run dev
# → http://localhost:3000
```

### 3. Frontend

Dans un **nouveau terminal** :

```bash
cd full-stack-app/frontend
npm install
npm run dev
# → http://localhost:5173
```

> Les deux serveurs doivent tourner **en même temps** : le frontend proxifie `/api/*` vers le backend via Vite.

---

## Variables d'environnement

Copier `full-stack-app/backend/.env.example` en `.env` et remplir :

| Variable | Obligatoire | Description |
|---|---|---|
| `MONGODB_URI` | Oui | URI MongoDB Atlas (`mongodb+srv://...`) ou local (`mongodb://localhost:27017/moodboard`) |
| `PORT` | Non | Port Express (défaut : `3000`) |
| `GOOGLE_CLIENT_ID` | Oui | Client ID OAuth Google |
| `GOOGLE_CLIENT_SECRET` | Oui | Client Secret OAuth Google |
| `SESSION_SECRET` | Oui | Chaîne aléatoire pour les sessions |
| `CLIENT_URL` | Oui | URL du frontend (`http://localhost:5173`) |
| `BACKEND_URL` | Oui | URL du backend (`http://localhost:3000`) |

### Configurer Google OAuth

1. Aller sur [console.cloud.google.com](https://console.cloud.google.com/)
2. Créer un projet → **APIs & Services** → **Credentials** → **Create OAuth 2.0 Client ID**
3. Type : **Web Application**
4. Ajouter dans **Authorized redirect URIs** :
   ```
   http://localhost:3000/api/auth/google/callback
   ```
5. Copier `Client ID` et `Client Secret` dans `.env`

---

## Accès réseau local (LAN) — tester avec d'autres appareils

Le frontend est configuré pour écouter sur toutes les interfaces (`host: true` dans `vite.config.ts`).
Au démarrage de Vite, l'IP LAN s'affiche :

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Les appareils sur le **même réseau WiFi** peuvent accéder à l'app via cette IP.

> **Limite OAuth** : Google OAuth ne fonctionne qu'avec `localhost` par défaut.
> Pour utiliser OAuth via LAN ou internet, utiliser **ngrok** (voir ci-dessous).

### Accès public avec ngrok

```bash
# Installer ngrok : https://ngrok.com/download
ngrok http 5173
# → https://xxxx.ngrok-free.app
```

Puis dans `full-stack-app/backend/.env` :
```
CLIENT_URL=https://xxxx.ngrok-free.app
BACKEND_URL=https://yyyy.ngrok-free.app
```

Et ajouter dans Google Cloud Console → Authorized redirect URIs :
```
https://yyyy.ngrok-free.app/api/auth/google/callback
```

---

## Commandes disponibles

### Backend

| Commande | Description |
|---|---|
| `npm run dev` | Serveur avec hot-reload (nodemon + tsx) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Lance le build compilé |

### Frontend

| Commande | Description |
|---|---|
| `npm run dev` | Serveur Vite avec hot-reload |
| `npm run build` | Build de production → `dist/` |
| `npm run preview` | Prévisualiser le build de production |
| `npm run lint` | Linter TypeScript/React |

---

## API — Endpoints

Toutes les routes `/api/notes` et `/api/board-moods` requièrent une session authentifiée (retournent `401` sinon).

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/auth/google` | — | Démarrer le flux OAuth Google |
| `GET` | `/api/auth/me` | Session | Utilisateur connecté |
| `POST` | `/api/auth/logout` | Session | Déconnexion |
| `GET` | `/api/notes?boardDate=YYYY-MM-DD` | Session | Notes du jour (filtrées par utilisateur) |
| `POST` | `/api/notes` | Session | Créer un cadre (image ou texte) |
| `PATCH` | `/api/notes/:id` | Session | Modifier un cadre |
| `DELETE` | `/api/notes/:id` | Session | Supprimer un cadre |
| `GET` | `/api/notes/heatmap?year=YYYY` | Session | Données heatmap annuelle |
| `GET` | `/api/board-moods?boardDate=YYYY-MM-DD` | Session | Humeur du jour |
| `PUT` | `/api/board-moods/:boardDate` | Session | Définir l'humeur du jour |

---

## Architecture

```
MoodBoard/
└── full-stack-app/
    ├── backend/                   # Express + TypeScript
    │   ├── src/
    │   │   ├── index.ts           # App, middleware, Passport OAuth
    │   │   ├── middleware/
    │   │   │   └── requireAuth.ts # Middleware 401 pour les routes protégées
    │   │   ├── models/            # User, Note, BoardMood (Mongoose)
    │   │   ├── routes/            # authRoutes, noteRoutes, boardMoodRoutes
    │   │   ├── types/
    │   │   │   └── express.d.ts   # Extension du type Express.User (Passport)
    │   │   └── utils/
    │   │       └── auth.ts        # Utilitaire getUserId(req)
    │   ├── .env                   # Variables locales (non committé)
    │   └── .env.example           # Template des variables d'environnement
    └── frontend/                  # React + Vite
        └── src/
            ├── App.tsx            # Root : heatmap + board quotidien
            ├── components/        # DailyBoard, EmotionalNote, MoodPicker…
            ├── hooks/             # useAuth, useBoard, useYearHeatmap
            ├── services/api/      # Fetch wrappers (notes, moods, heatmap)
            ├── constants/         # moodVisuals, frameShapes
            └── types/             # TypeScript types (Post, MoodId…)
```

---

## Fonctionnalités

- **Connexion Google** — authentification OAuth 2.0, sélection de compte forcée
- **Données privées** — chaque compte a ses propres notes et heatmap (filtrage par `userId`)
- **Heatmap annuelle** — 12 mois × 31 jours, couleur = humeur dominante, intensité = nombre de cadres
- **Board quotidien** — canvas 3 000 × 2 000 px, glisser-déposer, zoom 40–200 %
- **Cadres image / texte** — ajout, déplacement, redimensionnement, suppression
- **5 humeurs** — serenity, wonder, tenderness, longing, quiet — couleur du board synchronisée sur tous les cadres
- **Mode lecture seule** — les jours passés ne sont pas modifiables
- **Responsive** — layout adaptatif desktop (côte à côte) et mobile (heatmap + board empilés)
