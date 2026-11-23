import { Router } from 'express';
import * as roomController from '../controllers/room.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', roomController.createRoom);
router.post('/join', roomController.joinRoom);
router.get('/my-rooms', roomController.getMyRooms);
router.get('/code/:code', roomController.getRoomByCode);
router.get('/:id/messages', roomController.getMessages);

export default router;
