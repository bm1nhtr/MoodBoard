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

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
}));

app.use(passport.initialize());
app.use(passport.session());

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

passport.serializeUser((user: any, done) => done(null, user._id.toString()));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get('/salut', (_req, res) => res.send('Welcome to the Express TypeScript API!'));
app.use('/api/auth',        authRouter);
app.use('/api/notes',       noteRouter);
app.use('/api/board-moods', boardMoodRouter);

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connecté à MongoDB');
    app.listen(port, () => {
      console.log(`Serveur démarré sur http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Erreur connexion MongoDB :', err);
  });
