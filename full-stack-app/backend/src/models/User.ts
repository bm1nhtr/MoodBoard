import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email:    { type: String, required: true },
  name:     { type: String, required: true },
  picture:  { type: String, default: '' },
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);
