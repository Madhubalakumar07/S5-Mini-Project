import { Router } from 'express';
import passport from 'passport';
import { login, register, logout, getMe } from '../controllers/authController.js';
import { googleAuth, googleAuthCallback, googleAuthFailure } from '../controllers/googleAuthController.js';
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

// ── Google OAuth ──────────────────────────────────────────────────────────
// Step 1: Redirect user to Google's consent screen
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Step 2: Google redirects back; passport verifies domain then issues JWT
router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err: any, user: any) => {
      if (err || !user) {
        // Domain restricted or other auth error — redirect with message
        return googleAuthFailure(req, res);
      }
      // Attach user to request so googleAuthCallback can read it
      req.user = user;
      next();
    })(req, res, next);
  },
  googleAuthCallback
);

export default router;


