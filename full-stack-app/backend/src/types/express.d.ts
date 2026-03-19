/**
 * Extension du type Express.User pour Passport.js.
 * Déclare la structure de req.user dans toute l'application backend,
 * ce qui évite d'utiliser `as any` dans les routes et middlewares.
 * Passport stocke l'objet complet après désérialisation (voir serializeUser/deserializeUser).
 */

declare global {
  namespace Express {
    interface User {
      /** Identifiant MongoDB de l'utilisateur */
      _id: { toString(): string };
      /** Identifiant Google (stable) */
      googleId: string;
      /** Adresse email du compte Google */
      email: string;
      /** Nom affiché */
      name: string;
      /** URL de la photo de profil Google */
      picture: string;
    }
  }
}

export {};
