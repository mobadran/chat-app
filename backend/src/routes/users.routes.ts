import { Router } from 'express';
import { getUser } from '#controllers/users.controller.js';
import { authenticateToken } from '#middlewares/auth.middleware.js';
const router = Router();

router.get('/users/:id', authenticateToken, getUser);

export default router;
