import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { NoteModel } from './models/Note.js';

dotenv.config();

const notes = [
  { pseudo: 'Marouane', texte: 'Bonne journée à tous !', couleur: 'yellow' },
  { pseudo: 'Alice', texte: 'Le café du matin, un must !', couleur: 'pink' },
  { pseudo: 'Bob', texte: 'Aujourd\'hui je code, demain je dors.', couleur: 'blue' },
  { pseudo: 'Clara', texte: 'Motivée comme jamais !', couleur: 'green' },
  { pseudo: 'David', texte: 'Les bugs font partie du voyage.', couleur: 'orange' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log(' Connecté à MongoDB');

  await NoteModel.deleteMany({});
  console.log(' Anciennes notes supprimées');

  await NoteModel.insertMany(notes);
  console.log(' Notes insérées !');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(console.error);