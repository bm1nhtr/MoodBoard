import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export const UserModel = mongoose.model('User', userSchema);

//TypeScript pour le front
export type User = {
  id: string;
  name: string;
  email: string;
}