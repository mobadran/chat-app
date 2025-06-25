import { Router } from 'express';
import { register, login, refresh, logout } from '#controllers/auth.controller.js';
import { authenticateToken } from '#middlewares/auth.middleware.js';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/refresh', refresh);
router.post('/logout', logout);

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});
router.post('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

export default router;
