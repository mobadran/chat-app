import { Router } from 'express';
import { authenticateToken } from '#middlewares/auth.middleware.js';
import validate from '#middlewares/validate.middleware.js';
import converationsValidator from '#validators/converations.validator.js';
import { createConversation } from '#controllers/conversations.controller.js';
const router = Router();

router.post('/conversations', authenticateToken, validate(converationsValidator.CreateConversation), createConversation);

export default router;
