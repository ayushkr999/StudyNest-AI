import fs from 'fs';
import { Document } from '../models/Document.js';
import { ChatSession } from '../models/ChatSession.js';
import { ChatMessage } from '../models/ChatMessage.js';
import { ApiError } from '../middleware/error.middleware.js';
import { extractPdfData } from './pdf.service.js';
import { createDocumentChunks } from './chunk.service.js';
import { generateEmbeddingsBatch } from './embedding.service.js';
import { upsertVectors, deleteDocumentVectors } from './qdrant.service.js';
import { retrieveRelevantChunks } from './retrieval.service.js';
import { getGeminiModel } from './gemini.service.js';

export const processAndIndexPdf = async (documentId, userId) => {
  const doc = await Document.findOne({ _id: documentId, user: userId });
  if (!doc) {
    throw new ApiError(404, 'Document record not found.');
  }

  try {
    doc.status = 'processing';
    await doc.save();

    // 1. Extract text and pages
    const { pages, totalPages } = await extractPdfData(doc.filePath);
    doc.totalPages = totalPages;

    // 2. Chunk text with LangChain splitter
    const chunks = await createDocumentChunks({
      pages,
      documentId: doc._id,
      documentName: doc.title,
      userId,
    });

    if (chunks.length === 0) {
      throw new Error('No readable text chunks could be produced from this PDF.');
    }

    // 3. Generate embeddings
    const chunksWithVectors = await generateEmbeddingsBatch(chunks);

    // 4. Upsert into Qdrant Cloud
    await upsertVectors(chunksWithVectors);

    // 5. Update MongoDB document status
    doc.chunkCount = chunks.length;
    doc.status = 'indexed';
    doc.errorMessage = null;
    await doc.save();

    return doc;
  } catch (err) {
    console.error(`[RAG Indexing Failed for ${documentId}]:`, err.message);
    doc.status = 'failed';
    doc.errorMessage = err.message;
    await doc.save();
    throw err;
  }
};

export const askDocumentQuestion = async ({ userId, sessionId, question, documentId, documentIds = [] }) => {
  if (!question || !question.trim()) {
    throw new ApiError(400, 'Question cannot be empty.');
  }

  // Determine target documents
  let targetDocIds = [];
  if (documentIds && documentIds.length > 0) {
    targetDocIds = documentIds;
  } else if (documentId) {
    targetDocIds = [documentId];
  }

  // Verify ownership of documents
  if (targetDocIds.length > 0) {
    const verifiedDocs = await Document.find({
      _id: { $in: targetDocIds },
      user: userId,
    });

    if (verifiedDocs.length === 0) {
      throw new ApiError(403, 'Unauthorized access or document does not exist.');
    }
  }

  // Retrieve or create chat session
  let session = null;
  if (sessionId) {
    session = await ChatSession.findOne({ _id: sessionId, user: userId });
  }

  if (!session) {
    session = await ChatSession.create({
      title: question.slice(0, 50) + (question.length > 50 ? '...' : ''),
      user: userId,
      document: targetDocIds.length === 1 ? targetDocIds[0] : null,
      isMultiDoc: targetDocIds.length > 1,
      selectedDocuments: targetDocIds,
    });
  }

  // Save student's user message
  await ChatMessage.create({
    session: session._id,
    user: userId,
    role: 'user',
    content: question,
  });

  // 1. Retrieve top chunks from Qdrant
  const retrievedChunks = await retrieveRelevantChunks({
    question,
    userId,
    documentIds: targetDocIds,
    limit: 5,
  });

  // Format context and sources
  const contextText = retrievedChunks
    .map(
      (chunk, index) =>
        `[Source ${index + 1} | Document: "${chunk.documentName}", Page ${chunk.pageNumber}]:\n${chunk.text}`
    )
    .join('\n\n---\n\n');

  const sources = retrievedChunks.map((c) => ({
    documentId: c.documentId,
    documentName: c.documentName,
    pageNumber: c.pageNumber,
    score: c.score,
    textSnippet: c.text.slice(0, 160) + '...',
  }));

  // 2. Build context-aware prompt for Gemini
  const prompt = `You are StudyNest AI, an authoritative, helpful, and precise academic tutor.
Answer the student's question based strictly on the retrieved context from their uploaded PDF document(s).

Rules:
1. Ground your answer in the provided context whenever possible.
2. Explicitly cite the document name and page number (e.g. "[Document Name, Page X]") when stating facts.
3. If the context does not contain enough information to answer definitively, state what the document covers and clarify what is missing.
4. Format your answer with clean Markdown, bold headers, and structured bullet points.

Retrieved Context:
${contextText || 'No direct matching excerpts found in the vector database.'}

Student's Question:
${question}

Your Answer:`;

  const model = getGeminiModel();
  let answer = '';
  if (!model) {
    answer =
      'AI configuration is missing or pending. Please set GEMINI_API_KEY in backend environment to receive live generated answers.';
  } else {
    try {
      const response = await model.generateContent(prompt);
      answer = response.response.text();
    } catch (err) {
      console.error('[RAG Generation Error]:', err.message);
      answer = `Unable to complete AI synthesis at this moment: ${err.message}`;
    }
  }

  // Save AI response message
  const assistantMsg = await ChatMessage.create({
    session: session._id,
    user: userId,
    role: 'assistant',
    content: answer,
    sources,
  });

  session.lastMessageAt = new Date();
  await session.save();

  return {
    sessionId: session._id,
    message: assistantMsg,
    sources,
  };
};

export const deleteDocument = async (documentId, userId) => {
  const doc = await Document.findOne({ _id: documentId, user: userId });
  if (!doc) {
    throw new ApiError(404, 'Document not found.');
  }

  // 1. Delete vectors from Qdrant
  await deleteDocumentVectors(documentId, userId);

  // 2. Delete file from disk if present
  if (fs.existsSync(doc.filePath)) {
    try {
      fs.unlinkSync(doc.filePath);
    } catch (e) {
      console.warn(`Failed to remove file ${doc.filePath}:`, e.message);
    }
  }

  // 3. Delete Document record
  await Document.deleteOne({ _id: documentId });

  return true;
};
