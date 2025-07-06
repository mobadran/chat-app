import { Router } from 'express';
import { authenticateToken } from '#middlewares/auth.middleware.js';
import validate from '#middlewares/validate.middleware.js';
import converationsValidator from '#validators/converations.validator.js';
import { createConversation, getConversations, getConversation } from '#controllers/conversations.controller.js';
const router = Router();

router.post('/conversations', authenticateToken, validate(converationsValidator.CreateConversation), createConversation);

router.get('/conversations', authenticateToken, getConversations);

router.get('/conversations/:id', authenticateToken, getConversation);

export default router;
