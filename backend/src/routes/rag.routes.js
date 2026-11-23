import { Router } from 'express';
import * as ragController from '../controllers/rag.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { uploadPdf } from '../middleware/upload.middleware.js';
import { aiLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

router.use(authenticate);

// Document management
router.post('/upload', uploadPdf.single('file'), ragController.uploadDocument);
router.post('/documents/:id/retry', ragController.retryIndexing);
router.get('/documents', ragController.getDocuments);
router.get('/documents/:id', ragController.getDocumentById);
router.delete('/documents/:id', ragController.deleteDocument);

// RAG Question Answering
router.post('/chat/ask', aiLimiter, ragController.askQuestion);

// Sessions & History
router.get('/chat/sessions', ragController.getChatSessions);
router.get('/chat/sessions/:sessionId', ragController.getSessionMessages);
router.delete('/chat/sessions/:sessionId', ragController.deleteChatSession);

export default router;
