import { Router } from 'express';
import passport from 'passport';
import { config } from '../config/index.js';
import { login, register, logout, getMe } from '../controllers/authController.js';
import {
  initiateGoogleAuth,
  devGoogleLogin,
  googleAuthCallback,
  googleAuthFailure,
  isGoogleOAuthConfigured,
} from '../controllers/googleAuthController.js';
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
// Step 1: Redirect user to Google's consent screen (or dev simulation if credentials absent)
router.get('/google', initiateGoogleAuth);

// Dev simulation endpoint
router.get('/google/dev-login', devGoogleLogin);
router.post('/google/dev-login', devGoogleLogin);

// Step 2: Google redirects back; passport verifies domain then issues JWT
router.get(
  '/google/callback',
  (req, res, next) => {
    if (!isGoogleOAuthConfigured()) {
      return res.redirect(`${config.frontendUrl}/login?error=google_not_configured`);
    }
    passport.authenticate('google', { session: false }, (err: any, user: any) => {
      if (err || !user) {
        // Domain restricted or not registered or other auth error — redirect with message
        return googleAuthFailure(req, res, err);
      }
      // Attach user to request so googleAuthCallback can read it
      req.user = user;
      next();
    })(req, res, next);
  },
  googleAuthCallback
);

export default router;
