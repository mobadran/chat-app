import { Router } from 'express';
import { register, login, refresh, logout } from '#controllers/auth.controller.js';
import { authenticateToken } from '#middlewares/auth.middleware.js';
import validate from '#middlewares/validate.middleware.js';
import authValidator from '#validators/auth.validator.js';

const router = Router();

router.post('/register', validate(authValidator.Register), register);
router.post('/login', validate(authValidator.Login), login);
router.get('/refresh', validate(authValidator.Refresh), refresh);
router.post('/logout', validate(authValidator.Refresh), logout);

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});
router.post('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

export default router;
