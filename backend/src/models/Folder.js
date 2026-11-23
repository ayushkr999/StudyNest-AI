import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
      maxlength: 100,
    },
    color: {
      type: String,
      default: '#10b981', // emerald
    },
    icon: {
      type: String,
      default: 'folder',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

folderSchema.index({ user: 1, name: 1 });

export const Folder = mongoose.model('Folder', folderSchema);
