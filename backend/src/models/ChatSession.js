import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'New Study Conversation',
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      default: null,
      index: true,
    },
    isMultiDoc: {
      type: Boolean,
      default: false,
    },
    selectedDocuments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

chatSessionSchema.index({ user: 1, updatedAt: -1 });

export const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
