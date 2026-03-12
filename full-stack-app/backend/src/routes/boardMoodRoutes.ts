import express, { Router, Request, Response } from 'express';
import { BoardMoodModel } from '../models/BoardMood.js';

const boardMoodRouter: Router = express.Router();

function getUserId(req: Request): string {
  const user = req.user as any;
  return user?._id?.toString() ?? 'anonymous';
}

boardMoodRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { boardDate } = req.query as Record<string, string>;
    if (!boardDate) return res.status(400).json({ message: 'boardDate requis' });
    const userId = getUserId(req);
    const entry = await BoardMoodModel.findOne({ boardDate, userId });
    res.json({ boardDate, userId, mood: entry?.mood ?? 'serenity' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

boardMoodRouter.put('/:boardDate', async (req: Request, res: Response) => {
  try {
    const { boardDate } = req.params;
    const { mood } = req.body as { mood: string };
    if (!mood) return res.status(400).json({ message: 'mood requis' });
    const userId = getUserId(req);
    const entry = await BoardMoodModel.findOneAndUpdate(
      { boardDate, userId },
      { mood },
      { upsert: true, new: true }
    );
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

export default boardMoodRouter;
