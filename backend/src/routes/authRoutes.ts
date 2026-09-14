import { Router } from 'express';
import { login, register, logout, getMe } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply rate limiting to sensitive auth endpoints
const limiter = authRateLimiter(30, 15 * 60 * 1000);

// Public routes
router.post('/login', limiter, login);
router.post('/register', limiter, register);
router.post('/logout', logout);

// Protected route (requires valid JWT)
router.get('/me', authenticateUser, getMe);

export default router;
