# Mood Board — Development Summary

> Fichier interne, version courte (pour frontend + backend).

---

## 1. Ce que fait le frontend aujourd’hui

![Aperçu de l’application](Screenshot%202026-03-05%20113615.png)

- **Vue principale (heatmap)**  
  - Vue année : 12 lignes (mois), 31 colonnes (jours).  
  - Chaque case = intensité + mood dominant d’un jour (mock).  
  - Clic sur une case accessible (à partir du 1er mars) → ouvre le board du jour.

  

- **Board du jour (canvas)**  
  - Grand canvas pan/scroll + zoom, plus large que l’écran.  
  - 2/3 droite de l’écran ; zoom et FAB (+) repositionnés dans la zone board.  
  - Cadres **image** et **texte** : formes rectangle / cercle / cœur, drag & drop, resize, clic droit → ordre des calques.  
  - Premier accès à un jour : template 3 images + 2 textes + guide pas à pas (image → texte → FAB → bloc collab).

- **Humeur & collab (mock)**  
  - 1 palette de 5 humeurs (`MoodId`) = 5 couleurs + labels fixes.  
  - Bloc “Humeurs du jour (démo collab)” :  
    - Moi : picker d’humeur (change la couleur de mes cadres).  
    - Alice / Bob : badges lecture seule avec couleur d’humeur.  
  - Chaque cadre a un `createdBy` mock (`me`, `alice`, `bob`) → badge auteur (M, A, B) sur la carte.

- **Données (mock)**  
  - `services/mock/posts.ts` :  
    - `getPostsByDate`, `addPost`, `updatePost`, `getYearHeatmap`, `getBoardMood`, `setBoardMood`, `getAccessibleDates`.  
    - Avant `DATA_CUTOFF_DATE` (1er mars) : uniquement mock heatmap.  
    - À partir du 1er mars : `realPosts` (posts en mémoire) + moods par board.  
  - `services/mock/collab.ts` :  
    - `getMockRoomMembers(myMood)` → renvoie Moi, Alice, Bob pour la démo collab.

**Stack front :** React 18, TypeScript, Vite, CSS modules/BEM. Commentaires et textes techniques en français.

---

## 2. Ce que le backend devra faire (à partir de ce frontend)

Objectif : remplacer progressivement les mocks par une API, sans changer le comportement du frontend.

### 2.1 Contrat de données à respecter

- **Types à suivre côté backend** (voir `full-stack-app/frontend/src/types/posts.ts`) :  
  - `Post` (cadre sur le board) : `id`, `boardDate (YYYY-MM-DD)`, `text`, `mood`, `shape`, `frameType`, `imageUrl?`, `x`, `y`, `width`, `height`, `zIndex`, `createdAt`, `createdBy?`.  
  - `DayHeatmapEntry` (une case de la heatmap) : `date`, `intensity`, `dominantMood`, `noteCount`.  
  - `MockRoomMember` (collab) : `id`, `name`, `isMe`, `mood`.
- Le backend doit **retourner les mêmes champs** que les mocks pour que le frontend n’ait pas besoin de changer.

### 2.2 Endpoints minimum à prévoir

- **Boards / cadres**  
  - `GET /api/boards/:date/posts` → retourne `Post[]` pour une date (`YYYY-MM-DD`).  
  - `POST /api/boards/:date/posts` → crée un `Post` à partir d’un payload type `CreatePostPayload` (sans `boardDate` dans le body, pris depuis `:date`).  
  - `PATCH /api/posts/:id` → met à jour un `Post` partiellement (`x`, `y`, `width`, `height`, `text`, `imageUrl`, `zIndex`, etc.).

- **Heatmap**  
  - `GET /api/heatmap/:year` → retourne les données pour construire la heatmap annuelle (équivalent de `getYearHeatmap(year)`).

- **Collab (démo)**  
  - Facultatif pour un premier jet : reproduire `getMockRoomMembers` côté backend, ou garder le mock côté frontend tant que l’auth/users ne sont pas prêts.

### 2.3 Authentification (Google / connexion de compte)

- **Côté frontend actuel**  
  - Page de connexion avec bouton « Se connecter avec Google » : **simulation uniquement** (pas d’appel API, `isLoggedIn` en state local).  
  - Aucun token ni session côté front pour l’instant.

- **Tâche backend**  
  - Mettre en place la **connexion de compte** (Google OAuth ou équivalent) :  
    - Redirection vers le fournisseur (Google), callback vers le backend.  
    - Créer ou récupérer l’utilisateur en base à partir du profil Google (id, email, nom, photo optionnelle).  
    - Retourner un **token de session** (JWT ou cookie de session) pour identifier l’utilisateur sur les requêtes suivantes.  
  - Exposer au minimum :  
    - Une route (ou URL) pour **lancer** le flux OAuth (lien « Se connecter avec Google »).  
    - Une route **callback** traitée par le backend après retour de Google.  
    - Une route **GET /api/me** (ou équivalent) pour que le frontend récupère l’utilisateur connecté et décide d’afficher l’app ou la page de login.  
  - Une fois l’auth en place : les champs `createdBy` et les membres du groupe (collab) pourront être basés sur de vrais utilisateurs au lieu des ids mock (`me`, `alice`, `bob`).

- **Intégration frontend (après backend prêt)**  
  - Remplacer le clic « Se connecter avec Google » par une redirection vers l’URL d’auth du backend.  
  - Après callback : stocker le token (cookie ou localStorage, selon ce que le backend envoie) et appeler `GET /api/me` pour initialiser l’état « utilisateur connecté ».  
  - Envoyer le token sur chaque requête API (header `Authorization` ou cookie).

### 2.4 Intégration avec le frontend

- Le frontend connaît déjà un **point de coupure temporel** (`DATA_CUTOFF_DATE`, 1er mars) :  
  - Avant cette date : on peut continuer d’afficher uniquement la heatmap mock (pas besoin de données backend).  
  - À partir de cette date : les fonctions mock (`getPostsByDate`, `addPost`, etc.) pourront être remplacées par des appels API.
- Stratégie recommandée :  
  1. Créer un module `services/api/posts.ts` qui expose **les mêmes fonctions** que `services/mock/posts.ts`, mais en appelant l’API REST.  
  2. Ajouter un “switch” (variable d’environnement) pour choisir **mock** ou **API** sans changer le reste du code.  
  3. Coder le backend en respectant exactement les types et formats (dates ISO, `YYYY-MM-DD`, etc.).

---

## 3. Notes pour la suite

- **Mock** : peut rester en place pour les démos (surtout pour les jours avant le 1er mars) même après branchement de l’API.

*Dernière mise à jour : résumé frontend + tâches backend (API, heatmap, auth Google / connexion de compte).*
