/**
 * Routes d'authentification Google OAuth 2.0.
 * Ces routes sont publiques (pas de requireAuth) car elles gèrent le flux de connexion.
 */

import express, { Router, Request, Response } from 'express';
import passport from 'passport';

const authRouter: Router = express.Router();

/**
 * GET /api/auth/google
 * Lance le flux OAuth Google. L'option prompt: 'select_account' force
 * l'affichage du sélecteur de compte même si une session Google est déjà active.
 */
authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
);

/**
 * GET /api/auth/google/callback
 * Callback appelé par Google après l'authentification.
 * En cas de succès : redirige vers le frontend. En cas d'échec : redirige vers /login.
 */
authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed` }),
  (_req: Request, res: Response) => {
    res.redirect(process.env.CLIENT_URL as string);
  }
);

/**
 * GET /api/auth/me
 * Retourne l'utilisateur de la session courante.
 * Utilisé par le frontend au démarrage pour vérifier si l'utilisateur est connecté.
 */
authRouter.get('/me', (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Non authentifié' });
  const user = req.user!;
  res.json({ id: user._id, name: user.name, email: user.email, picture: user.picture });
});

/**
 * POST /api/auth/logout
 * Déconnecte l'utilisateur : détruit la session serveur et supprime le cookie de session.
 */
authRouter.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Erreur déconnexion' });
    req.session.destroy(() => {
      res.clearCookie('connect.sid');  // supprime le cookie de session côté client
      res.json({ message: 'Déconnecté' });
    });
  });
});

export default authRouter;
