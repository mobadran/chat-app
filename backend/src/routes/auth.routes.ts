import { Router } from 'express';
import { register, login, refresh, logout } from '#controllers/auth.controller.js';
import validate from '#middlewares/validate.middleware.js';
import authValidator from '#validators/auth.validator.js';

const router = Router();

router.post('/auth/register', validate(authValidator.Register), register);
router.post('/auth/login', validate(authValidator.Login), login);
router.get('/auth/refresh', validate(authValidator.Refresh), refresh);
router.post('/auth/logout', validate(authValidator.Refresh), logout);

export default router;
