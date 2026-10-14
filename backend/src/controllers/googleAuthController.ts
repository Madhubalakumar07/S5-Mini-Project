import { Request, Response } from 'express';
import { config } from '../config/index.js';

/**
 * Initiates the Google OAuth flow.
 * Passport middleware handles the actual redirect — this handler is never called directly.
 */
export const googleAuth = (_req: Request, _res: Response): void => {
  // Handled by passport.authenticate middleware
};

/**
 * Callback after Google returns the user.
 * Reads the JWT + user injected by the Passport strategy and redirects to the frontend.
 */
export const googleAuthCallback = (req: Request, res: Response): void => {
  const authData = req.user as { user: any; token: string } | undefined;

  if (!authData?.token) {
    res.redirect(`${config.frontendUrl}/login?error=google_auth_failed`);
    return;
  }

  const { user, token } = authData;

  // Build a compact user payload for the frontend
  const userPayload = encodeURIComponent(
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      rollNumber: user.rollNumber,
      batch: user.batch,
      phone: user.phone,
      cgpa: user.cgpa,
    })
  );

  // Redirect to frontend callback page with token + user
  res.redirect(
    `${config.frontendUrl}/auth/google/callback?token=${encodeURIComponent(token)}&user=${userPayload}`
  );
};

/**
 * Called when passport.authenticate fails (e.g. domain restriction).
 * Redirects to the login page with a human-readable error message.
 */
export const googleAuthFailure = (req: Request, res: Response): void => {
  const msg = encodeURIComponent(
    `Only @${config.orgEmailDomain} Google accounts are permitted. Please sign in with your institutional email.`
  );
  res.redirect(`${config.frontendUrl}/login?error=domain_restricted&msg=${msg}`);
};
