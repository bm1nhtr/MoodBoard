/**
 * Routes API pour les humeurs quotidiennes (BoardMood).
 * Toutes les routes sont protégées par requireAuth (appliqué dans index.ts).
 * Un utilisateur ne peut avoir qu'une seule humeur par jour (contrainte d'unicité).
 */

import express, { Router, Request, Response } from 'express';
import { BoardMoodModel } from '../models/BoardMood.js';
import { getUserId } from '../utils/auth.js';

const boardMoodRouter: Router = express.Router();

/**
 * GET /api/board-moods?boardDate=YYYY-MM-DD
 * Retourne l'humeur du jour pour l'utilisateur connecté.
 * Retourne 'serenity' par défaut si aucune humeur n'a encore été enregistrée.
 */
boardMoodRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { boardDate } = req.query as Record<string, string>;
    if (!boardDate) return res.status(400).json({ message: 'boardDate requis' });
    const userId = getUserId(req);
    const entry = await BoardMoodModel.findOne({ boardDate, userId });
    res.json({ boardDate, userId, mood: entry?.mood ?? 'serenity' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * PUT /api/board-moods/:boardDate
 * Crée ou met à jour l'humeur du jour (upsert).
 * Utilisé lors du changement de mood dans le MoodPicker.
 */
boardMoodRouter.put('/:boardDate', async (req: Request, res: Response) => {
  try {
    const { boardDate } = req.params;
    const { mood } = req.body as { mood: string };
    if (!mood) return res.status(400).json({ message: 'mood requis' });
    const userId = getUserId(req);
    const entry = await BoardMoodModel.findOneAndUpdate(
      { boardDate, userId },
      { $set: { mood } },
      { upsert: true, new: true }  // crée le document s'il n'existe pas encore
    );
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default boardMoodRouter;
