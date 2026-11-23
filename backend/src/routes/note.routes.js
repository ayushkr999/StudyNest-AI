import { Router } from 'express';
import * as noteController from '../controllers/note.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/recent', noteController.getRecentNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.patch('/:id/pin', noteController.togglePin);

export default router;
