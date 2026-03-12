import express, { Router, Request, Response } from 'express';
import { NoteModel } from '../models/Note.js';

const noteRouter: Router = express.Router();

noteRouter.get('/heatmap', async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const start = `${year}-01-01`;
    const end   = `${year}-12-31`;

    const notes = await NoteModel.find({
      boardDate: { $gte: start, $lte: end },
    }).select('boardDate mood');

    const byDay: Record<string, { count: number; moods: string[] }> = {};
    notes.forEach((n) => {
      if (!byDay[n.boardDate]) byDay[n.boardDate] = { count: 0, moods: [] };
      byDay[n.boardDate].count += 1;
      byDay[n.boardDate].moods.push(n.mood);
    });

    const maxCount = Math.max(1, ...Object.values(byDay).map((v) => v.count));

    const entries = Object.entries(byDay).map(([date, data]) => {
      const freq: Record<string, number> = {};
      data.moods.forEach((m) => { freq[m] = (freq[m] ?? 0) + 1; });
      const dominantMood = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
      return { date, intensity: data.count / maxCount, dominantMood, noteCount: data.count };
    });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

noteRouter.get('/', async (req: Request, res: Response) => {
  try {
    const filter: any = {};
    if (req.query.boardDate) filter.boardDate = req.query.boardDate;
    const notes = await NoteModel.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

noteRouter.post('/', async (req: Request, res: Response) => {
  try {
    console.log('Body recu:', JSON.stringify(req.body));
    const newNote = await NoteModel.create(req.body);
    res.status(201).json(newNote);
  } catch (err: any) {
    console.error('Erreur POST:', err.message);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

noteRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await NoteModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Note not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

noteRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await NoteModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: deleted._id + ' deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

export default noteRouter;
