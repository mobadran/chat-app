import { Router } from 'express';
import { getUser, updateAvatar } from '#controllers/users.controller.js';
import { authenticateToken } from '#middlewares/auth.middleware.js';
import multer from 'multer';

const upload = multer();
const router = Router();

router.get('/users/:id', authenticateToken, getUser);
router.post('/users/:id/avatar', authenticateToken, upload.single('avatar'), updateAvatar);

export default router;
