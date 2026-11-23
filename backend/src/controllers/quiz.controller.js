import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import * as quizService from '../services/quiz.service.js';

export const generateQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.generateQuiz(req.user._id, req.body);
  return ApiResponse.created(res, quiz, 'Quiz generated successfully.');
});

export const getQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await quizService.getQuizzes(req.user._id);
  return ApiResponse.success(res, quizzes, 'Quizzes retrieved.');
});

export const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await quizService.getQuizById(req.user._id, req.params.id);
  return ApiResponse.success(res, quiz, 'Quiz retrieved.');
});

export const submitAttempt = asyncHandler(async (req, res) => {
  const attempt = await quizService.submitQuizAttempt(req.user._id, req.params.id, req.body);
  return ApiResponse.created(res, attempt, 'Quiz submitted and evaluated.');
});

export const getAttempts = asyncHandler(async (req, res) => {
  const attempts = await quizService.getQuizAttempts(req.user._id, req.query.quizId);
  return ApiResponse.success(res, attempts, 'Quiz attempts retrieved.');
});
