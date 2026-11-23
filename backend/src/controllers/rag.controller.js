import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../middleware/error.middleware.js';
import { Document } from '../models/Document.js';
import { ChatSession } from '../models/ChatSession.js';
import { ChatMessage } from '../models/ChatMessage.js';
import * as ragService from '../services/rag.service.js';

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please select a valid PDF file to upload.');
  }

  const { title } = req.body;
  const doc = await Document.create({
    title: title || req.file.originalname.replace(/\.[^/.]+$/, ''),
    originalName: req.file.originalname,
    filePath: req.file.path,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    status: 'pending',
    user: req.user._id,
  });

  // Start background indexing process
  ragService.processAndIndexPdf(doc._id, req.user._id).catch((err) => {
    console.error(`Background indexing failed for doc ${doc._id}:`, err.message);
  });

  return ApiResponse.created(
    res,
    doc,
    'PDF uploaded successfully. Vector indexing is underway.'
  );
});

export const retryIndexing = asyncHandler(async (req, res) => {
  const doc = await ragService.processAndIndexPdf(req.params.id, req.user._id);
  return ApiResponse.success(res, doc, 'Document indexed successfully.');
});

export const getDocuments = asyncHandler(async (req, res) => {
  const docs = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
  return ApiResponse.success(res, docs, 'Documents retrieved.');
});

export const getDocumentById = asyncHandler(async (req, res) => {
  const doc = await Document.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) {
    throw new ApiError(404, 'Document not found.');
  }
  return ApiResponse.success(res, doc, 'Document details retrieved.');
});

export const deleteDocument = asyncHandler(async (req, res) => {
  await ragService.deleteDocument(req.params.id, req.user._id);
  return ApiResponse.success(res, null, 'Document and associated vectors deleted successfully.');
});

export const askQuestion = asyncHandler(async (req, res) => {
  const { question, sessionId, documentId, documentIds } = req.body;
  const result = await ragService.askDocumentQuestion({
    userId: req.user._id,
    sessionId,
    question,
    documentId,
    documentIds,
  });
  return ApiResponse.success(res, result, 'Response retrieved successfully.');
});

export const getChatSessions = asyncHandler(async (req, res) => {
  const sessions = await ChatSession.find({ user: req.user._id })
    .populate('document', 'title originalName')
    .sort({ lastMessageAt: -1 });
  return ApiResponse.success(res, sessions, 'Chat sessions retrieved.');
});

export const getSessionMessages = asyncHandler(async (req, res) => {
  const session = await ChatSession.findOne({ _id: req.params.sessionId, user: req.user._id });
  if (!session) {
    throw new ApiError(404, 'Chat session not found.');
  }

  const messages = await ChatMessage.find({ session: req.params.sessionId }).sort({ createdAt: 1 });
  return ApiResponse.success(res, { session, messages }, 'Chat history retrieved.');
});

export const deleteChatSession = asyncHandler(async (req, res) => {
  const session = await ChatSession.findOneAndDelete({ _id: req.params.sessionId, user: req.user._id });
  if (!session) {
    throw new ApiError(404, 'Chat session not found.');
  }
  await ChatMessage.deleteMany({ session: req.params.sessionId });
  return ApiResponse.success(res, null, 'Chat session deleted.');
});
