import { Router } from 'express';
import * as quizController from '../controllers/quiz.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/generate', aiLimiter, quizController.generateQuiz);
router.get('/', quizController.getQuizzes);
router.get('/attempts', quizController.getAttempts);
router.get('/:id', quizController.getQuizById);
router.post('/:id/attempt', quizController.submitAttempt);

export default router;
