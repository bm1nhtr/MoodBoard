# Mood Board Collaboratif

Mur de post-it numériques pour partager des pensées et humeurs quotidiennes.  
Stack : **React 19 + TypeScript + Vite** (frontend) · **Express 5 + TypeScript + MongoDB** (backend).

---

## Prérequis

| Outil | Version minimale |
|---|---|
| [Node.js](https://nodejs.org/) | 18+ |
| [npm](https://www.npmjs.com/) | 9+ |
| [MongoDB](https://www.mongodb.com/) | local **ou** [Atlas](https://www.mongodb.com/cloud/atlas) (gratuit) |

---

## Quickstart

```bash
# 1. Cloner le repo
git clone <url-du-repo>
cd MoodBoard

# 2. Installer les dépendances backend
cd full-stack-app/backend
npm install

# 3. Configurer l'environnement backend
cp .env.example .env
# → Ouvrir .env et renseigner MONGODB_URI

# 4. Démarrer le backend  (port 3000)
npm run dev

# 5. Dans un nouveau terminal — installer et démarrer le frontend (port 5173)
cd ../frontend
npm install
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173) dans le navigateur.

> Les deux serveurs doivent tourner **en même temps** : le frontend proxifie `/api/*` vers le backend.

---

## Variables d'environnement

Copier `full-stack-app/backend/.env.example` en `.env` et remplir les valeurs.

| Variable | Obligatoire | Description |
|---|---|---|
| `MONGODB_URI` | Oui | URI de connexion MongoDB (local ou Atlas) |
| `PORT` | Non | Port Express (défaut : `3000`) |

> Le fichier `.env` est ignoré par git. Ne jamais committer de credentials.

---

## Dépendances principales

### Backend (`full-stack-app/backend`)

| Package | Rôle |
|---|---|
| `express` | Serveur HTTP |
| `mongoose` | ODM MongoDB |
| `cors` | Headers CORS |
| `dotenv` | Chargement `.env` |
| `typescript` + `ts-node` | TypeScript en dev |
| `tsup` | Build de production |
| `nodemon` | Hot-reload dev |

### Frontend (`full-stack-app/frontend`)

| Package | Rôle |
|---|---|
| `react` + `react-dom` | UI |
| `typescript` | Typage statique |
| `vite` | Bundler / dev server |
| `eslint` | Linter |

---

## Commandes disponibles

### Backend

| Commande | Description |
|---|---|
| `npm run dev` | Serveur avec hot-reload (nodemon) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Lance le build compilé |
| `npm run seed` | Insère des données de test dans MongoDB |

### Frontend

| Commande | Description |
|---|---|
| `npm run dev` | Serveur Vite avec hot-reload |
| `npm run build` | Build de production → `dist/` |
| `npm run preview` | Prévisualiser le build de production |
| `npm run lint` | Linter le code TypeScript/React |

---

## API — Endpoints

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/notes?boardDate=YYYY-MM-DD` | Récupérer les notes d'un jour |
| `POST` | `/api/notes` | Créer une nouvelle note |
| `PATCH` | `/api/notes/:id` | Modifier une note |
| `DELETE` | `/api/notes/:id` | Supprimer une note |
