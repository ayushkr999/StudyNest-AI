import mongoose from 'mongoose';

const flashcardDeckSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Deck title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      default: null,
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      default: null,
    },
    cardCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

flashcardDeckSchema.index({ user: 1, updatedAt: -1 });

export const FlashcardDeck = mongoose.model('FlashcardDeck', flashcardDeckSchema);
