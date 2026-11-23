import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import * as geminiService from '../services/gemini.service.js';

export const summarizeNote = asyncHandler(async (req, res) => {
  const summary = await geminiService.summarizeNote(req.user._id, req.params.noteId, req.body);
  return ApiResponse.success(res, { summary }, 'Summary generated successfully.');
});

export const summarizeFolder = asyncHandler(async (req, res) => {
  const summary = await geminiService.summarizeFolder(req.user._id, req.params.folderId, req.body);
  return ApiResponse.success(res, { summary }, 'Folder summary generated successfully.');
});

export const explainConcept = asyncHandler(async (req, res) => {
  const explanation = await geminiService.explainConcept(req.body);
  return ApiResponse.success(res, { explanation }, 'Concept explained successfully.');
});

export const generateExamQuestions = asyncHandler(async (req, res) => {
  const questions = await geminiService.generateExamQuestions(req.user._id, req.body);
  return ApiResponse.success(res, { questions }, 'Exam questions generated.');
});

export const generateRevisionNotes = asyncHandler(async (req, res) => {
  const revisionNotes = await geminiService.generateRevisionNotes(req.user._id, req.body);
  return ApiResponse.success(res, { revisionNotes }, 'Revision notes generated.');
});

export const chatWithAi = asyncHandler(async (req, res) => {
  const response = await geminiService.generalStudyChat(req.body);
  return ApiResponse.success(res, { response }, 'Response generated.');
});
