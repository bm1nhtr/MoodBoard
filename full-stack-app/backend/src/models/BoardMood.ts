import mongoose from 'mongoose';

const boardMoodSchema = new mongoose.Schema({
  boardDate: { type: String, required: true },
  userId:    { type: String, default: 'anonymous' },
  mood:      { type: String, default: 'serenity' },
}, { timestamps: true });

boardMoodSchema.index({ boardDate: 1, userId: 1 }, { unique: true });

export const BoardMoodModel = mongoose.model('BoardMood', boardMoodSchema);
