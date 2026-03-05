import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from './models/User.js';

dotenv.config();

const users = [
  { name: 'Alice Dupont', email: 'alice@gmail.com' },
  { name: 'Bob Martin', email: 'bob@gmail.com' },
  { name: 'Clara Bernard', email: 'clara@gmail.com' },
  { name: 'David Leroy', email: 'david@gmail.com' },
  { name: 'Emma Petit', email: 'emma@gmail.com' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log(' Connecté à MongoDB');

  await UserModel.deleteMany({});
  console.log(' Anciens users supprimés');

  await UserModel.insertMany(users);
  console.log(' Users insérés !');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(console.error);