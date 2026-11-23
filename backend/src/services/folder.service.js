import { Folder } from '../models/Folder.js';
import { Note } from '../models/Note.js';
import { ApiError } from '../middleware/error.middleware.js';

export const createFolder = async (userId, { name, color, icon, parentFolder }) => {
  if (!name || !name.trim()) {
    throw new ApiError(400, 'Folder name is required.');
  }

  const folder = await Folder.create({
    name: name.trim(),
    color: color || '#10b981',
    icon: icon || 'folder',
    parentFolder: parentFolder || null,
    user: userId,
  });

  return folder;
};

export const getFolders = async (userId) => {
  const folders = await Folder.find({ user: userId }).sort({ createdAt: -1 });

  // Get note counts per folder
  const noteCounts = await Note.aggregate([
    { $match: { user: userId, folder: { $ne: null } } },
    { $group: { _id: '$folder', count: { $sum: 1 } } },
  ]);

  const countMap = {};
  noteCounts.forEach((nc) => {
    countMap[nc._id.toString()] = nc.count;
  });

  return folders.map((folder) => ({
    ...folder.toObject(),
    noteCount: countMap[folder._id.toString()] || 0,
  }));
};

export const updateFolder = async (userId, folderId, { name, color, icon }) => {
  const folder = await Folder.findOne({ _id: folderId, user: userId });
  if (!folder) {
    throw new ApiError(404, 'Folder not found.');
  }

  if (name && name.trim()) folder.name = name.trim();
  if (color) folder.color = color;
  if (icon) folder.icon = icon;

  await folder.save();
  return folder;
};

export const deleteFolder = async (userId, folderId) => {
  const folder = await Folder.findOne({ _id: folderId, user: userId });
  if (!folder) {
    throw new ApiError(404, 'Folder not found.');
  }

  // Detach all notes in this folder rather than deleting them
  await Note.updateMany({ folder: folderId, user: userId }, { $set: { folder: null } });

  await Folder.deleteOne({ _id: folderId });
  return true;
};
