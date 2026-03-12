import express, { Router, Request, Response } from 'express';
import passport from 'passport';

const authRouter: Router = express.Router();

/** Lance le flux OAuth Google */
authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/** Callback après authentification Google */
authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed` }),
  (_req: Request, res: Response) => {
    res.redirect(process.env.CLIENT_URL as string);
  }
);

/** Retourne l'utilisateur connecté ou 401 */
authRouter.get('/me', (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Non authentifié' });
  const user = req.user as any;
  res.json({ id: user._id, name: user.name, email: user.email, picture: user.picture });
});

/** Déconnexion */
authRouter.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Erreur déconnexion' });
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Déconnecté' });
    });
  });
});

export default authRouter;
