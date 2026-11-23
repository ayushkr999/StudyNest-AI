import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getMe);
router.get('/profile', userController.getMe);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);

export default router;
