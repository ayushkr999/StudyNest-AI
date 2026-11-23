import { Note } from '../models/Note.js';
import { Folder } from '../models/Folder.js';
import { ApiError } from '../middleware/error.middleware.js';

export const createNote = async (userId, { title, content, folder, tags, isPinned }) => {
  if (folder) {
    const validFolder = await Folder.findOne({ _id: folder, user: userId });
    if (!validFolder) {
      throw new ApiError(404, 'Folder not found.');
    }
  }

  const note = await Note.create({
    title: title || 'Untitled Note',
    content: content || '',
    folder: folder || null,
    tags: Array.isArray(tags) ? tags : [],
    isPinned: Boolean(isPinned),
    user: userId,
    lastEditedAt: new Date(),
  });

  return note;
};

export const getNotes = async (userId, query = {}) => {
  const { folder, search, tag, isPinned, sortBy = 'updatedAt', sortOrder = 'desc', limit = 50, page = 1 } = query;

  const filter = { user: userId, isArchived: false };

  if (folder !== undefined) {
    if (folder === 'null' || folder === '' || folder === 'root') {
      filter.folder = null;
    } else {
      filter.folder = folder;
    }
  }

  if (tag) {
    filter.tags = tag;
  }

  if (isPinned !== undefined) {
    filter.isPinned = isPinned === 'true' || isPinned === true;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const sort = {};
  if (isPinned === undefined) {
    sort.isPinned = -1;
  }
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

  const [notes, total] = await Promise.all([
    Note.find(filter)
      .populate('folder', 'name color icon')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Note.countDocuments(filter),
  ]);

  return {
    notes,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
};

export const getNoteById = async (userId, noteId) => {
  const note = await Note.findOne({ _id: noteId, user: userId }).populate('folder', 'name color icon');
  if (!note) {
    throw new ApiError(404, 'Note not found.');
  }
  return note;
};

export const updateNote = async (userId, noteId, updates) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) {
    throw new ApiError(404, 'Note not found.');
  }

  if (updates.folder !== undefined) {
    if (updates.folder) {
      const validFolder = await Folder.findOne({ _id: updates.folder, user: userId });
      if (!validFolder) {
        throw new ApiError(404, 'Destination folder not found.');
      }
      note.folder = updates.folder;
    } else {
      note.folder = null;
    }
  }

  if (updates.title !== undefined) note.title = updates.title;
  if (updates.content !== undefined) note.content = updates.content;
  if (updates.tags !== undefined) note.tags = updates.tags;
  if (updates.isPinned !== undefined) note.isPinned = updates.isPinned;
  if (updates.isArchived !== undefined) note.isArchived = updates.isArchived;

  note.lastEditedAt = new Date();
  await note.save();

  return note.populate('folder', 'name color icon');
};

export const deleteNote = async (userId, noteId) => {
  const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
  if (!note) {
    throw new ApiError(404, 'Note not found.');
  }
  return true;
};

export const togglePinNote = async (userId, noteId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) {
    throw new ApiError(404, 'Note not found.');
  }

  note.isPinned = !note.isPinned;
  await note.save();
  return note;
};

export const getRecentNotes = async (userId, limit = 5) => {
  return Note.find({ user: userId, isArchived: false })
    .populate('folder', 'name color icon')
    .sort({ lastEditedAt: -1, updatedAt: -1 })
    .limit(limit);
};
