import { Router } from 'express';
import * as aiController from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

router.use(authenticate);
router.use(aiLimiter);

router.post('/summarize-note/:noteId', aiController.summarizeNote);
router.post('/summarize-folder/:folderId', aiController.summarizeFolder);
router.post('/explain-concept', aiController.explainConcept);
router.post('/exam-questions', aiController.generateExamQuestions);
router.post('/revision-notes', aiController.generateRevisionNotes);
router.post('/chat', aiController.chatWithAi);

export default router;
