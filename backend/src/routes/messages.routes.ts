import { Router } from 'express';
import { authenticateToken } from '#middlewares/auth.middleware.js';
import validate from '#middlewares/validate.middleware.js';
import messagesValidator from '#validators/messages.validator.js';
import { getMessages, sendMessage } from '#controllers/messages.controller.js';
const router = Router();

router.post('/conversations/:conversationId/messages', authenticateToken, validate(messagesValidator.SendMessage), sendMessage);

router.get('/conversations/:conversationId/messages', authenticateToken, getMessages);

export default router;
