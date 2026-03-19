/**
 * Modèle Mongoose pour l'humeur quotidienne d'un board.
 * Chaque utilisateur a une humeur unique par jour (contrainte d'unicité boardDate + userId).
 * Créée ou mise à jour via upsert lors du choix de l'humeur dans le MoodPicker.
 */

import mongoose from 'mongoose';

const boardMoodSchema = new mongoose.Schema({
  /** Date du board (format YYYY-MM-DD) */
  boardDate: { type: String, required: true },
  /** Id de l'utilisateur propriétaire */
  userId:    { type: String, default: 'anonymous' },
  /** Humeur sélectionnée pour ce jour */
  mood:      { type: String, default: 'serenity' },
}, { timestamps: true });

// Garantit qu'un utilisateur ne peut avoir qu'une seule humeur par jour
boardMoodSchema.index({ boardDate: 1, userId: 1 }, { unique: true });

export const BoardMoodModel = mongoose.model('BoardMood', boardMoodSchema);
