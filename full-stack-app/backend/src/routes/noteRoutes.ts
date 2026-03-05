import express, { Router, Request, Response } from 'express';
import { NoteModel } from '../models/Note.js';

const noteRouter: Router = express.Router();

// GET: Récupérer toutes les notes
noteRouter.get('/', async (req: Request, res: Response) => {
  try {
    const notes = await NoteModel.find().sort({ createdAt: -1 });
    res.json({ message: 'List of notes', notes });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// POST: Ajouter une note
noteRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newNote = await NoteModel.create(req.body);
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// PATCH: Modifier le texte d'une note
noteRouter.patch('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await NoteModel.findByIdAndUpdate(
      req.params.id,
      { texte: req.body.texte },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Note not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// DELETE: Supprimer une note
noteRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await NoteModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: `Note ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

export default noteRouter;