import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import * as noteService from '../services/note.service.js';

export const createNote = asyncHandler(async (req, res) => {
  const note = await noteService.createNote(req.user._id, req.body);
  return ApiResponse.created(res, note, 'Note created successfully.');
});

export const getNotes = asyncHandler(async (req, res) => {
  const result = await noteService.getNotes(req.user._id, req.query);
  return ApiResponse.success(res, result, 'Notes retrieved.');
});

export const getRecentNotes = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 5;
  const recent = await noteService.getRecentNotes(req.user._id, limit);
  return ApiResponse.success(res, recent, 'Recent notes retrieved.');
});

export const getNoteById = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteById(req.user._id, req.params.id);
  return ApiResponse.success(res, note, 'Note details retrieved.');
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await noteService.updateNote(req.user._id, req.params.id, req.body);
  return ApiResponse.success(res, note, 'Note updated successfully.');
});

export const deleteNote = asyncHandler(async (req, res) => {
  await noteService.deleteNote(req.user._id, req.params.id);
  return ApiResponse.success(res, null, 'Note deleted successfully.');
});

export const togglePin = asyncHandler(async (req, res) => {
  const note = await noteService.togglePinNote(req.user._id, req.params.id);
  return ApiResponse.success(res, note, `Note ${note.isPinned ? 'pinned' : 'unpinned'}.`);
});
