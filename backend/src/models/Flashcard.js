import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema(
  {
    deck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FlashcardDeck',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    front: {
      type: String,
      required: [true, 'Front content is required'],
    },
    back: {
      type: String,
      required: [true, 'Back content is required'],
    },
    hint: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['learning', 'known', 'needs_revision'],
      default: 'learning',
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    intervalDays: {
      type: Number,
      default: 1,
    },
    easeFactor: {
      type: Number,
      default: 2.5,
    },
    nextReviewDate: {
      type: Date,
      default: Date.now,
    },
    lastReviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

flashcardSchema.index({ deck: 1, nextReviewDate: 1 });
flashcardSchema.index({ user: 1, status: 1 });

export const Flashcard = mongoose.model('Flashcard', flashcardSchema);
