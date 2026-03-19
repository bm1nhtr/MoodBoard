/**
 * Routes API pour les cadres (notes) : CRUD complet + agrégation heatmap.
 * Toutes les routes sont protégées par requireAuth (appliqué dans index.ts).
 * Chaque opération est filtrée par userId pour isoler les données par utilisateur.
 */

import express, { Router, Request, Response } from 'express';
import { NoteModel } from '../models/Note.js';
import { BoardMoodModel } from '../models/BoardMood.js';
import { getUserId } from '../utils/auth.js';

const noteRouter: Router = express.Router();

/**
 * GET /api/notes/heatmap?year=YYYY
 * Agrège les notes et les board moods de l'année pour produire les données de la heatmap.
 * Retourne un tableau de { date, intensity, dominantMood, noteCount }.
 * La route /heatmap doit être déclarée AVANT la route GET / pour éviter les conflits Express.
 */
noteRouter.get('/heatmap', async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const start = `${year}-01-01`;
    const end   = `${year}-12-31`;
    const userId = getUserId(req);

    // Charge en parallèle les notes et les board moods de l'année
    const [notes, boardMoods] = await Promise.all([
      NoteModel.find({ boardDate: { $gte: start, $lte: end }, userId }).select('boardDate mood'),
      BoardMoodModel.find({ boardDate: { $gte: start, $lte: end }, userId }).select('boardDate mood'),
    ]);

    // Index boardDate → mood pour un accès rapide lors du calcul de la couleur
    const boardMoodByDate: Record<string, string> = {};
    boardMoods.forEach((bm) => { boardMoodByDate[bm.boardDate] = bm.mood; });

    // Agrégation des notes par jour : compte et liste des moods
    const byDay: Record<string, { count: number; moods: string[] }> = {};
    notes.forEach((n) => {
      if (!byDay[n.boardDate]) byDay[n.boardDate] = { count: 0, moods: [] };
      byDay[n.boardDate].count += 1;
      byDay[n.boardDate].moods.push(n.mood);
    });

    // Inclut aussi les jours où un BoardMood a été défini mais sans notes créées
    Object.keys(boardMoodByDate).forEach((date) => {
      if (!byDay[date]) byDay[date] = { count: 0, moods: [] };
    });

    // Normalise l'intensité entre 0 et 1 (ratio relatif au jour le plus actif)
    const maxCount = Math.max(1, ...Object.values(byDay).map((v) => v.count));

    const entries = Object.entries(byDay).map(([date, data]) => {
      // Calcule le mood le plus fréquent parmi les notes du jour
      const freq: Record<string, number> = {};
      data.moods.forEach((m) => { freq[m] = (freq[m] ?? 0) + 1; });
      const dominantNoteMood = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

      // Le BoardMood est prioritaire sur le mood dominant des notes pour la couleur
      const dominantMood = boardMoodByDate[date] ?? dominantNoteMood;

      // Intensité minimale de 0.2 si un BoardMood est défini même sans notes
      const intensity = data.count > 0 ? data.count / maxCount : (boardMoodByDate[date] ? 0.2 : 0);

      return { date, intensity, dominantMood, noteCount: data.count };
    });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * GET /api/notes?boardDate=YYYY-MM-DD
 * Retourne tous les cadres de l'utilisateur pour un jour donné, du plus récent au plus ancien.
 */
noteRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const filter: { userId: string; boardDate?: string } = { userId };
    if (req.query.boardDate) filter.boardDate = req.query.boardDate as string;
    const notes = await NoteModel.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * POST /api/notes
 * Crée un nouveau cadre en associant automatiquement l'userId de la session.
 * Retourne le cadre créé avec le statut 201.
 */
noteRouter.post('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const newNote = await NoteModel.create({ ...req.body, userId });
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * PATCH /api/notes/:id
 * Met à jour partiellement un cadre (position, taille, texte, image…).
 * Vérifie que le cadre appartient à l'utilisateur connecté avant modification.
 */
noteRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const updated = await NoteModel.findOneAndUpdate(
      { _id: req.params.id, userId },  // double vérification : id + propriétaire
      { $set: req.body },
      { new: true }                    // retourne le document après mise à jour
    );
    if (!updated) return res.status(404).json({ message: 'Note introuvable' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/notes/:id
 * Supprime un cadre. Vérifie que le cadre appartient à l'utilisateur connecté.
 */
noteRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const deleted = await NoteModel.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) return res.status(404).json({ message: 'Note introuvable' });
    res.json({ message: `${deleted._id} supprimée` });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default noteRouter;
