import express, { Router, Request, Response } from 'express';

const userRouter: Router = express.Router();

// GET: Fetch all users
userRouter.get('/', (req: Request, res: Response) => {
  res.json({ message: 'List of users', users: [] });
});

// GET: Fetch a user by ID
userRouter.get('/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  res.json({ message: `User with ID ${id}`, user: {} });
});

// POST: Create a user
userRouter.post('/', (req: Request, res: Response) => {
  const { name, email } = req.body;
  res.json({ message: 'User created', user: { name, email } });
});

// PUT: Update a user
userRouter.put('/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, email } = req.body;
  res.json({ message: `User ${id} updated`, user: { name, email } });
});

// DELETE: Delete a user
userRouter.delete('/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  res.json({ message: `User ${id} deleted` });
});

export default userRouter;