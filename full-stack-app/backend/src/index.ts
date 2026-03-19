/**
 * Point d'entrée du serveur Express.
 * Configure les middlewares (CORS, session, Passport), la stratégie Google OAuth,
 * enregistre les routes API, puis démarre le serveur après connexion à MongoDB.
 */

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import noteRouter from './routes/noteRoutes.js';
import boardMoodRouter from './routes/boardMoodRoutes.js';
import authRouter from './routes/authRoutes.js';
import { UserModel } from './models/User.js';
import { requireAuth } from './middleware/requireAuth.js';

// Charge les variables d'environnement depuis .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ── Middlewares globaux ──────────────────────────────────────────────────────

// Parsing JSON et form-data (limite 10 Mo pour les images en base64)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// CORS : autorise les requêtes du frontend avec cookies de session
app.use(cors({
  origin: true,       // reflète l'origine de la requête (dev seulement)
  credentials: true,  // nécessaire pour envoyer les cookies de session
}));

// Session Express : persistance de l'authentification entre les requêtes
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },  // session valide 7 jours
}));

// Initialisation de Passport (gestion de l'authentification)
app.use(passport.initialize());
app.use(passport.session());

// ── Stratégie Google OAuth 2.0 ──────────────────────────────────────────────

passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL:  `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/auth/google/callback`,
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value ?? '';
      const picture = profile.photos?.[0]?.value ?? '';
      // Upsert : crée l'utilisateur s'il n'existe pas, met à jour sinon
      const user = await UserModel.findOneAndUpdate(
        { googleId: profile.id },
        { googleId: profile.id, email, name: profile.displayName, picture },
        { upsert: true, new: true }
      );
      return done(null, user);
    } catch (err) {
      return done(err as Error);
    }
  }
));

// Sérialisation : stocke uniquement l'id MongoDB en session (pas tout l'objet user)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => done(null, user._id.toString()));

// Désérialisation : recharge l'utilisateur complet depuis MongoDB à chaque requête
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ── Routes API ───────────────────────────────────────────────────────────────

// Routes d'authentification (OAuth Google, /me, /logout) — publiques
app.use('/api/auth',        authRouter);

// Routes protégées : requireAuth renvoie 401 si la session n'est pas valide
app.use('/api/notes',       requireAuth, noteRouter);
app.use('/api/board-moods', requireAuth, boardMoodRouter);

// ── Connexion MongoDB et démarrage du serveur ────────────────────────────────

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connecté à MongoDB');
    app.listen(port, () => {
      console.log(`Serveur démarré sur http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Erreur connexion MongoDB :', err);
    process.exit(1);  // arrête le processus si MongoDB est inaccessible
  });
