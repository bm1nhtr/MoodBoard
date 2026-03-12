import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { NoteModel } from './models/Note.js';

dotenv.config();

const today = new Date().toISOString().slice(0, 10);

const notes = [
  { pseudo: 'Marouane', texte: 'Bonne journée à tous !', couleur: 'yellow', mood: 'serenity', boardDate: today, shape: 'rectangle', frameType: 'text', x: 80,  y: 80,  width: 220, height: 120, zIndex: 0 },
  { pseudo: 'Alice',    texte: 'Le café du matin, un must !', couleur: 'pink', mood: 'wonder', boardDate: today, shape: 'circle', frameType: 'text', x: 340, y: 100, width: 200, height: 200, zIndex: 1 },
  { pseudo: 'Bob',      texte: "Aujourd'hui je code, demain je dors.", couleur: 'blue', mood: 'quiet', boardDate: today, shape: 'rectangle', frameType: 'text', x: 140, y: 280, width: 240, height: 120, zIndex: 2 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connecté à MongoDB');
  await NoteModel.deleteMany({});
  console.log('Anciennes notes supprimées');
  await NoteModel.insertMany(notes);
  console.log('Notes insérées !');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(console.error);