import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env.js';
import { Note } from '../models/Note.js';
import { Folder } from '../models/Folder.js';
import { ApiError } from '../middleware/error.middleware.js';

let genAI = null;
let currentKey = null;

export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || ENV.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini] Warning: GEMINI_API_KEY is not configured in backend environment.');
    return null;
  }
  if (!genAI || currentKey !== apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    currentKey = apiKey;
  }
  return genAI;
};

export const getGeminiModel = (modelName = process.env.GEMINI_MODEL || ENV.GEMINI_MODEL || 'gemini-3.5-flash') => {
  const client = getGeminiClient();
  if (!client) return null;
  return client.getGenerativeModel({ model: modelName });
};

export const getGeminiEmbeddingModel = (
  embeddingModelName = process.env.GEMINI_EMBEDDING_MODEL || ENV.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001'
) => {
  const client = getGeminiClient();
  if (!client) return null;
  return client.getGenerativeModel({ model: embeddingModelName });
};

export const callGemini = async (prompt, systemInstruction = '') => {
  const model = getGeminiModel();
  if (!model) {
    throw new ApiError(
      503,
      'Gemini AI service is currently unavailable. Please verify GEMINI_API_KEY is configured in backend environment.'
    );
  }

  try {
    const fullPrompt = systemInstruction ? `${systemInstruction}\n\nTask:\n${prompt}` : prompt;
    const response = await model.generateContent(fullPrompt);
    const text = response.response.text();
    return text;
  } catch (err) {
    console.error('[Gemini AI Error]:', err.message);
    if (err.message && (err.message.includes('quota') || err.message.includes('429'))) {
      throw new ApiError(429, 'AI quota limitation reached. Please try again in a few moments.');
    }
    throw new ApiError(500, `Gemini AI Error: ${err.message || 'Failed to generate response'}`);
  }
};

export const summarizeNote = async (userId, noteId, { style = 'detailed' }) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) {
    throw new ApiError(404, 'Note not found.');
  }

  if (!note.content || note.content.trim().length === 0) {
    throw new ApiError(400, 'Note content is empty. Cannot summarize.');
  }

  const prompt = `You are StudyNest AI, an expert academic tutor. Summarize the following study note.
Summary Style requested: ${style} (e.g. "short": 2-3 concise paragraphs, "detailed": comprehensive breakdown, "bullet-points": high-impact key takeaways).

Title: ${note.title}
Content:
${note.content}

Return a structured markdown response with clear headings and bullet points.`;

  return callGemini(prompt, 'You are an elite academic assistant focused on clear, high-retention student summaries.');
};

export const summarizeFolder = async (userId, folderId, { style = 'detailed' }) => {
  const folder = await Folder.findOne({ _id: folderId, user: userId });
  if (!folder) {
    throw new ApiError(404, 'Folder not found.');
  }

  const notes = await Note.find({ folder: folderId, user: userId });
  if (!notes || notes.length === 0) {
    throw new ApiError(400, 'No notes found inside this folder to summarize.');
  }

  const combinedContent = notes
    .map((n, i) => `### Note ${i + 1}: ${n.title}\n${n.content}`)
    .join('\n\n---\n\n');

  const prompt = `You are StudyNest AI. Provide a cohesive, comprehensive summary of an entire study folder named "${folder.name}".
Summary Style requested: ${style}.

Folder contents:
${combinedContent}

Synthesize these notes into a unified curriculum summary, highlighting core concepts, interconnections, and critical takeaways. Respond in structured Markdown.`;

  return callGemini(prompt, 'You are an academic curriculum synthesizer providing students with high-yield overview summaries.');
};

export const explainConcept = async ({ concept, context = '', targetAudience = 'university student' }) => {
  if (!concept) {
    throw new ApiError(400, 'Please provide the concept you want explained.');
  }

  const prompt = `Explain the following concept in intuitive, easy-to-understand language for a ${targetAudience}:
Concept: "${concept}"
${context ? `Additional Context: ${context}` : ''}

Structure your explanation as follows:
1. **The 30-Second Intuition** (Simple analogy or ELI5)
2. **Deep-Dive Mechanics** (How it actually works under the hood)
3. **Real-World Example / Case Study**
4. **Common Pitfalls & Misconceptions**
5. **Quick Self-Check Question**`;

  return callGemini(prompt, 'You are Richard Feynman meets an elite university professor: crystal clear, engaging, and precise.');
};

export const generateExamQuestions = async (userId, { noteId, topic, count = 5 }) => {
  let material = '';
  if (noteId) {
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (note) {
      material = `Title: ${note.title}\nContent:\n${note.content}`;
    }
  }

  if (!material && !topic) {
    throw new ApiError(400, 'Please provide either a noteId or a specific topic.');
  }

  const prompt = `Generate ${count} high-yield, exam-oriented questions (mix of conceptual, analytical, and application-based).
${topic ? `Topic: ${topic}` : ''}
${material ? `Based on this study material:\n${material}` : ''}

For each question:
- Provide the Question
- Provide the Expected Model Answer
- Include a "Grading Criteria / Key Points Required for Full Marks"`;

  return callGemini(prompt, 'You are a strict yet supportive university exam curator.');
};

export const generateRevisionNotes = async (userId, { noteId, topic }) => {
  let material = '';
  if (noteId) {
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (note) {
      material = `Title: ${note.title}\nContent:\n${note.content}`;
    }
  }

  if (!material && !topic) {
    throw new ApiError(400, 'Please provide either a note or a topic.');
  }

  const prompt = `Create a high-density "Last-Minute Revision Sheet" (Cheat Sheet style) based on:
${topic ? `Topic: ${topic}\n` : ''}
${material ? `Material:\n${material}` : ''}

Format requirements:
- **Core Formulas / Definitions**
- **Key Mnemonics / Memory Hacks**
- **Critical Principles (Must-know for exams)**
- **Frequently Tested Traps**
Use concise Markdown tables, bold keywords, and clean bullet lists.`;

  return callGemini(prompt, 'You are an academic coach creating high-yield active recall revision notes.');
};

export const generalStudyChat = async ({ messages = [], userQuery = '' }) => {
  if (!userQuery && messages.length === 0) {
    throw new ApiError(400, 'Query cannot be empty.');
  }

  const formattedHistory = messages
    .slice(-8)
    .map((m) => `${m.role === 'user' ? 'Student' : 'StudyNest AI'}: ${m.content}`)
    .join('\n');

  const prompt = `Conversation History:
${formattedHistory}

Student: ${userQuery}

Respond as StudyNest AI, an encouraging, pedagogically rigorous, and insightful AI study tutor. Use clean Markdown formatting with math notation (LaTeX) where applicable.`;

  return callGemini(prompt, 'You are StudyNest AI, the ultimate intelligent learning companion.');
};
