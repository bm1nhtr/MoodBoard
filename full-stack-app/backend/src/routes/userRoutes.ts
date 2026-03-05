import express, { Router, Request, Response } from 'express';
import { UserModel } from '../models/User.js';

const userRouter: Router = express.Router();

// GET: Fetch all users
userRouter.get('/', async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json({ message: 'List of users', users });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// GET: Fetch a user by ID
userRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// POST: Create a user
userRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newUser = await UserModel.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// PUT: Update a user
userRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// DELETE: Delete a user
userRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await UserModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `User ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

export default userRouter;