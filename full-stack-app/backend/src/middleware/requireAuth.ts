/**
 * Middleware de protection des routes authentifiées.
 * Si la session Passport est valide, passe au handler suivant.
 * Sinon, répond immédiatement avec 401 Unauthorized.
 * Utilisé dans index.ts sur les routes /api/notes et /api/board-moods.
 */

import type { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.status(401).json({ message: 'Non authentifié' });
}
