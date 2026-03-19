/**
 * Modèle Mongoose pour les utilisateurs.
 * Un utilisateur est créé (ou mis à jour) automatiquement lors de la première connexion Google OAuth.
 * L'identifiant unique est le googleId fourni par Google.
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  /** Identifiant Google unique (stable même si l'email change) */
  googleId: { type: String, required: true, unique: true },
  /** Adresse email du compte Google */
  email:    { type: String, required: true },
  /** Nom affiché (displayName Google) */
  name:     { type: String, required: true },
  /** URL de la photo de profil Google */
  picture:  { type: String, default: '' },
}, { timestamps: true });  // ajoute createdAt et updatedAt automatiquement

export const UserModel = mongoose.model('User', userSchema);
