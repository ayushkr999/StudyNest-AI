import { Router } from 'express';
import * as flashcardController from '../controllers/flashcard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/decks', flashcardController.createDeck);
router.get('/decks', flashcardController.getDecks);
router.get('/decks/:id', flashcardController.getDeckById);
router.delete('/decks/:id', flashcardController.deleteDeck);

router.post('/decks/:deckId/cards', flashcardController.addCard);
router.patch('/cards/:cardId/review', flashcardController.reviewCard);

router.post('/generate', aiLimiter, flashcardController.generateCards);

export default router;
