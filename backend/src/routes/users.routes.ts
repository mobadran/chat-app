import { Router } from 'express';
import { getUser, updateAvatar, updateUser } from '#controllers/users.controller.js';
import { authenticateToken } from '#middlewares/auth.middleware.js';
import multer from 'multer';
import validate from '#middlewares/validate.middleware.js';
import usersValidator from '#validators/users.validator.js';

const upload = multer();
const router = Router();

router.get('/users/:id', authenticateToken, getUser);
router.post('/users/avatar', authenticateToken, upload.single('avatar'), updateAvatar);
router.patch('/users', authenticateToken, validate(usersValidator.UpdateUser), updateUser);

export default router;
