import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  pseudo: { type: String, required: true },
  texte: { type: String, required: true },
  couleur: { type: String, required: true },
}, { timestamps: true });

export const NoteModel = mongoose.model('Note', noteSchema);