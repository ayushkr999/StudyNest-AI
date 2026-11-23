import { Router } from 'express';
import * as folderController from '../controllers/folder.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', folderController.createFolder);
router.get('/', folderController.getFolders);
router.put('/:id', folderController.updateFolder);
router.delete('/:id', folderController.deleteFolder);

export default router;
