import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId:    { type: String, default: '' },
  pseudo:    { type: String, required: true },
  texte:     { type: String, default: '' },
  couleur:   { type: String, default: 'yellow' },
  mood:      { type: String, default: 'serenity' },
  boardDate: { type: String, required: true },
  shape:     { type: String, default: 'rectangle' },
  frameType: { type: String, default: 'text' },
  imageUrl:  { type: String, default: '' },
  x:         { type: Number, default: 80 },
  y:         { type: Number, default: 80 },
  width:     { type: Number, default: 200 },
  height:    { type: Number, default: 180 },
  zIndex:    { type: Number, default: 0 },
}, { timestamps: true });

export const NoteModel = mongoose.model('Note', noteSchema);