import express, { Router, Request, Response } from 'express';
import { NoteModel } from '../models/Note.js';
import { BoardMoodModel } from '../models/BoardMood.js';

const noteRouter: Router = express.Router();

function getUserId(req: Request): string {
  const user = req.user as any;
  return user?._id?.toString() ?? 'anonymous';
}

noteRouter.get('/heatmap', async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const start = `${year}-01-01`;
    const end   = `${year}-12-31`;
    const userId = getUserId(req);

    const [notes, boardMoods] = await Promise.all([
      NoteModel.find({ boardDate: { $gte: start, $lte: end }, userId }).select('boardDate mood'),
      BoardMoodModel.find({ boardDate: { $gte: start, $lte: end }, userId }).select('boardDate mood'),
    ]);

    // Map boardDate → BoardMood (priorité sur les moods des notes)
    const boardMoodByDate: Record<string, string> = {};
    boardMoods.forEach((bm) => { boardMoodByDate[bm.boardDate] = bm.mood; });

    // Agrégation des notes par jour
    const byDay: Record<string, { count: number; moods: string[] }> = {};
    notes.forEach((n) => {
      if (!byDay[n.boardDate]) byDay[n.boardDate] = { count: 0, moods: [] };
      byDay[n.boardDate].count += 1;
      byDay[n.boardDate].moods.push(n.mood);
    });

    // Inclure les jours avec BoardMood mais sans notes
    Object.keys(boardMoodByDate).forEach((date) => {
      if (!byDay[date]) byDay[date] = { count: 0, moods: [] };
    });

    const maxCount = Math.max(1, ...Object.values(byDay).map((v) => v.count));

    const entries = Object.entries(byDay).map(([date, data]) => {
      const freq: Record<string, number> = {};
      data.moods.forEach((m) => { freq[m] = (freq[m] ?? 0) + 1; });
      const dominantNoteMood = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

      // BoardMood en priorité pour la couleur, sinon mood dominant des notes
      const dominantMood = boardMoodByDate[date] ?? dominantNoteMood;

      // Intensité : ratio notes, minimum 0.2 si BoardMood défini sans notes
      const intensity = data.count > 0 ? data.count / maxCount : (boardMoodByDate[date] ? 0.2 : 0);

      return { date, intensity, dominantMood, noteCount: data.count };
    });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

noteRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const filter: any = { userId };
    if (req.query.boardDate) filter.boardDate = req.query.boardDate;
    const notes = await NoteModel.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

noteRouter.post('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const newNote = await NoteModel.create({ ...req.body, userId });
    res.status(201).json(newNote);
  } catch (err: any) {
    console.error('Erreur POST:', err.message);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

noteRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const updated = await NoteModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Note not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

noteRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const deleted = await NoteModel.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: deleted._id + ' deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

export default noteRouter;
