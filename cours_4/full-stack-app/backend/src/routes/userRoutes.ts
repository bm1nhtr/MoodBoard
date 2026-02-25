import express, { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {User} from '../models/User';

const userRouter: Router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, 'users.json');

// Helper to read JSON safely
const readData = () => {
  try {
    const content = fs.readFileSync(DATA_PATH, 'utf-8');
    // If file is empty string, return empty array
    if (!content || content.trim() === "") {
      return [];
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading users.json, resetting to empty list:", error);
    return [];
  }
};
const writeData = (data: any) => fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

// Ensure the file exists on startup
if (!fs.existsSync(DATA_PATH)) {
  writeData([]);
}

// GET: Fetch all users
userRouter.get('/', (req: Request, res: Response) => {
  const users = readData();
  res.json({ message: 'List of users', users });
});

// GET: Fetch a user by ID
userRouter.get('/:id', (req: Request, res: Response<User|Record<string,string>>) => {
  const users = readData();
  const user = users.find((u: User) => u.id === req.params.id);
  
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// POST: Create a user
userRouter.post('/', (req: Request, res: Response<User|Record<string,string>>) => {
  const users = readData();
  const newUser = { id: Date.now().toString(), ...req.body };
  
  users.push(newUser);
  writeData(users);
  res.status(201).json(newUser);
});

// PUT: Update a user
userRouter.put('/:id', (req: Request, res: Response<User|Record<string,string>>) => {
  let users = readData();
  const index = users.findIndex((u: User) => u.id === req.params.id);

  if (index === -1) return res.status(404).json({ message: 'User not found' });

  users[index] = { ...users[index], ...req.body };
  writeData(users);
  res.json(users[index]);
});

// DELETE: Delete a user
userRouter.delete('/:id', (req: Request, res: Response<Record<string,string>>) => {
  const users = readData();
  const filteredUsers = users.filter((u: User) => u.id !== req.params.id);

  if (users.length === filteredUsers.length) {
    return res.status(404).json({ message: 'User not found' });
  }

  writeData(filteredUsers);
  res.json({ message: `User ${req.params.id} deleted` });
});

export default userRouter;