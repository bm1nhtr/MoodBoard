/**
 * Modèle Mongoose pour les cadres (notes) du board.
 * Un cadre appartient à un utilisateur et à un jour donné (boardDate).
 * Il peut contenir une image (imageUrl) ou du texte, et est positionné librement sur le canvas.
 */

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  /** Id de l'utilisateur propriétaire (correspondant à User._id) */
  userId:    { type: String, default: '' },
  /** Contenu texte du cadre (vide pour les cadres image) */
  text:      { type: String, default: '' },
  /** Humeur associée au cadre (héritée du mood du jour) */
  mood:      { type: String, default: 'serenity' },
  /** Date du board auquel appartient ce cadre (format YYYY-MM-DD) */
  boardDate: { type: String, required: true },
  /** Forme visuelle du cadre (rectangle, circle, heart) */
  shape:     { type: String, default: 'rectangle' },
  /** Type de contenu : 'image' ou 'text' */
  frameType: { type: String, default: 'text' },
  /** URL de l'image (data URL ou lien externe) */
  imageUrl:  { type: String, default: '' },
  /** Position horizontale sur le canvas (px) */
  x:         { type: Number, default: 80 },
  /** Position verticale sur le canvas (px) */
  y:         { type: Number, default: 80 },
  /** Largeur du cadre (px) */
  width:     { type: Number, default: 200 },
  /** Hauteur du cadre (px) */
  height:    { type: Number, default: 180 },
  /** Ordre d'empilement CSS (z-index) */
  zIndex:    { type: Number, default: 0 },
}, { timestamps: true });

export const NoteModel = mongoose.model('Note', noteSchema);
