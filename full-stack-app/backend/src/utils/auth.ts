/**
 * Utilitaire d'authentification partagé entre les routes.
 * Centralise l'extraction de l'id utilisateur depuis la session Passport.
 */

import type { Request } from 'express';

/**
 * Retourne l'id MongoDB (_id) de l'utilisateur connecté sous forme de string.
 * Retourne 'anonymous' si la session ne contient pas d'utilisateur
 * (ne devrait pas arriver sur les routes protégées par requireAuth).
 */
export function getUserId(req: Request): string {
  const user = req.user as { _id?: { toString(): string } } | undefined;
  return user?._id?.toString() ?? 'anonymous';
}
