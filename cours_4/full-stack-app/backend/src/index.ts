import express from 'express';
import cors from 'cors'; // Import cors
import userRouter from './routes/userRoutes.js';

console.log("HELLO !")
const app = express();
const port = 3000;

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware pour parser le JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Basic route
app.get('/salut', (req, res) => {
  console.log("salut l'équipe !") // <= Dans la console
  res.send('Welcome to the Express TypeScript API!'); // <= Dans votre navigateur
});

app.use('/api/users', userRouter);


// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

