import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { Note } from '../models/Note.js';
import { Document } from '../models/Document.js';
import { ApiError } from '../middleware/error.middleware.js';
import { getGeminiModel } from './gemini.service.js';

export const generateQuiz = async (userId, { topic, noteId, documentId, difficulty = 'medium', questionCount = 5 }) => {
  let material = '';
  let derivedTopic = topic || 'General Knowledge';

  if (noteId) {
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (note) {
      material = `Title: ${note.title}\nContent:\n${note.content}`;
      derivedTopic = note.title;
    }
  } else if (documentId) {
    const doc = await Document.findOne({ _id: documentId, user: userId });
    if (doc) {
      material = `Document Title: ${doc.title}`;
      derivedTopic = doc.title;
    }
  }

  if (!material && !topic) {
    throw new ApiError(400, 'Please provide a topic, noteId or documentId to generate a quiz.');
  }

  const model = getGeminiModel();
  if (!model) {
    throw new ApiError(503, 'Gemini AI is not available to generate quizzes.');
  }

  const prompt = `You are StudyNest AI's expert examination designer.
Generate an academic quiz consisting of ${questionCount} multiple-choice questions (MCQs).
Topic: ${derivedTopic}
Difficulty: ${difficulty}
${material ? `Based on this study content:\n${material}` : ''}

Output strictly valid JSON matching this schema:
{
  "title": "${derivedTopic} Quiz (${difficulty.toUpperCase()})",
  "description": "Assessment testing knowledge on ${derivedTopic}",
  "questions": [
    {
      "question": "Clear question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact string of the correct option",
      "explanation": "Clear explanation of why this answer is correct and why other options are incorrect."
    }
  ]
}

No preamble, no postscript. Return only the JSON object.`;

  try {
    const response = await model.generateContent(prompt);
    let rawText = response.response.text().trim();
    rawText = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

    const parsed = JSON.parse(rawText);

    const quiz = await Quiz.create({
      title: parsed.title || `${derivedTopic} Quiz`,
      description: parsed.description || '',
      topic: derivedTopic,
      difficulty,
      questions: parsed.questions,
      user: userId,
      note: noteId || null,
      document: documentId || null,
    });

    return quiz;
  } catch (err) {
    console.error('[Quiz Generation Error]:', err.message);
    throw new ApiError(500, `Failed to generate quiz: ${err.message}`);
  }
};

export const submitQuizAttempt = async (userId, quizId, { answers, timeSpentSeconds }) => {
  const quiz = await Quiz.findOne({ _id: quizId, user: userId });
  if (!quiz) {
    throw new ApiError(404, 'Quiz not found.');
  }

  let correctCount = 0;
  const processedAnswers = [];
  const weakTopics = [];

  quiz.questions.forEach((q, idx) => {
    const userAnswer = answers.find((a) => a.questionIndex === idx);
    const selectedOption = userAnswer ? userAnswer.selectedOption : '';
    const isCorrect = selectedOption.trim() === q.correctAnswer.trim();

    if (isCorrect) {
      correctCount += 1;
    } else {
      weakTopics.push(`Question ${idx + 1}: ${q.question.slice(0, 60)}...`);
    }

    processedAnswers.push({
      questionIndex: idx,
      questionText: q.question,
      selectedOption,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    });
  });

  const totalQuestions = quiz.questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const attempt = await QuizAttempt.create({
    quiz: quizId,
    user: userId,
    answers: processedAnswers,
    score: correctCount,
    totalQuestions,
    percentage,
    weakTopics,
    timeSpentSeconds: timeSpentSeconds || 0,
  });

  return attempt;
};

export const getQuizzes = async (userId) => {
  const quizzes = await Quiz.find({ user: userId }).sort({ createdAt: -1 });
  return quizzes;
};

export const getQuizById = async (userId, quizId) => {
  const quiz = await Quiz.findOne({ _id: quizId, user: userId });
  if (!quiz) {
    throw new ApiError(404, 'Quiz not found.');
  }
  return quiz;
};

export const getQuizAttempts = async (userId, quizId = null) => {
  const filter = { user: userId };
  if (quizId) filter.quiz = quizId;

  const attempts = await QuizAttempt.find(filter)
    .populate('quiz', 'title topic difficulty')
    .sort({ createdAt: -1 });

  return attempts;
};
