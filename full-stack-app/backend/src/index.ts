import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import noteRouter from './routes/noteRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Basic route
app.get('/salut', (req, res) => {
  console.log("salut l'équipe !")
  res.send('Welcome to the Express TypeScript API!');
});


app.use('/api/notes', noteRouter);

// Connexion MongoDB puis démarrage serveur
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log(' Connecté à MongoDB');
    app.listen(port, () => {
      console.log(`Serveur démarré sur http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Erreur connexion MongoDB :', err);
  });