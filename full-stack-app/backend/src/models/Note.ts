import mongoose from 'mongoose';

//Mongoose gère les types en interne, pas besoin de les redéfinir ici pour le backend
const noteSchema = new mongoose.Schema({
  pseudo: { type: String, required: true },
  texte: { type: String, required: true },
  couleur: { type: String, required: true },
}, { timestamps: true });

export const NoteModel = mongoose.model('Note', noteSchema);