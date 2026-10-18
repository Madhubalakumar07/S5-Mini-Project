import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { userRepository } from '../repositories/userRepository.js';

export const isGoogleOAuthConfigured = (): boolean => {
  return Boolean(config.googleClientId && config.googleClientSecret);
};

/**
 * Initiates the Google OAuth flow.
 * If GOOGLE_CLIENT_ID is configured, redirects to Google's consent screen via Passport.
 * In development without credentials, provides a simulated Institutional Google Sign-In page.
 */
export const initiateGoogleAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (isGoogleOAuthConfigured()) {
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
    return;
  }

  // Development simulation if Google OAuth credentials are not set in .env
  if (config.nodeEnv === 'development') {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CampusAI - Google Institutional Sign-In</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #090d16;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 1.5rem;
    }
    .card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 1rem;
      padding: 2.25rem;
      max-width: 460px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header {
      text-align: center;
      margin-bottom: 1.75rem;
    }
    .badge {
      display: inline-block;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.35);
      color: #a5b4fc;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      margin-bottom: 0.85rem;
      letter-spacing: 0.025em;
    }
    h2 { margin: 0 0 0.5rem 0; font-size: 1.35rem; font-weight: 700; color: #ffffff; }
    p { margin: 0; color: #94a3b8; font-size: 0.875rem; line-height: 1.5; }
    .account-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: 1.5rem 0;
    }
    .account-btn {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.75rem;
      padding: 0.85rem 1rem;
      color: #f1f5f9;
      cursor: pointer;
      text-align: left;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .account-btn:hover {
      background: #334155;
      border-color: #6366f1;
      transform: translateY(-1px);
    }
    .avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 9999px;
      background: #4f46e5;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      flex-shrink: 0;
    }
    .acc-name { font-weight: 600; font-size: 0.9rem; color: #f8fafc; }
    .acc-email { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }
    .custom-form {
      border-top: 1px solid #1f2937;
      padding-top: 1.25rem;
      margin-top: 1.25rem;
    }
    .input-group {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.65rem;
    }
    input {
      flex: 1;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      padding: 0.65rem 0.85rem;
      color: #fff;
      font-size: 0.875rem;
    }
    input:focus {
      outline: none;
      border-color: #6366f1;
    }
    .submit-btn {
      background: #4f46e5;
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      padding: 0.65rem 1.15rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .submit-btn:hover { background: #4338ca; }
    .footer-note {
      margin-top: 1.5rem;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 0.5rem;
      padding: 0.75rem 0.85rem;
      font-size: 0.75rem;
      color: #64748b;
      line-height: 1.45;
    }
    .footer-note code { color: #a5b4fc; background: #1e293b; padding: 0.1rem 0.3rem; border-radius: 0.25rem; }
    .back-link {
      display: block;
      text-align: center;
      margin-top: 1rem;
      color: #64748b;
      text-decoration: none;
      font-size: 0.8125rem;
    }
    .back-link:hover { color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">Development Mode</div>
      <h2>Google Institutional Sign-In</h2>
      <p>Simulating OAuth for <strong>@${config.orgEmailDomain}</strong> accounts</p>
    </div>

    <div class="account-list">
      <a class="account-btn" href="/api/auth/google/dev-login?email=rahul.kumar%40bitsathy.ac.in">
        <div class="avatar">RK</div>
        <div>
          <div class="acc-name">Rahul Kumar (Student)</div>
          <div class="acc-email">rahul.kumar@bitsathy.ac.in</div>
        </div>
      </a>
      <a class="account-btn" href="/api/auth/google/dev-login?email=sneha.mohan%40bitsathy.ac.in">
        <div class="avatar" style="background:#0ea5e9;">SM</div>
        <div>
          <div class="acc-name">Sneha Mohan (Student)</div>
          <div class="acc-email">sneha.mohan@bitsathy.ac.in</div>
        </div>
      </a>
      <a class="account-btn" href="/api/auth/google/dev-login?email=uma.m%40bitsathy.ac.in">
        <div class="avatar" style="background:#8b5cf6;">UM</div>
        <div>
          <div class="acc-name">Dr. Uma Maheshwari (Faculty/Staff)</div>
          <div class="acc-email">uma.m@bitsathy.ac.in</div>
        </div>
      </a>
    </div>

    <form class="custom-form" action="/api/auth/google/dev-login" method="GET">
      <p style="font-weight:500; font-size:0.8125rem; color:#cbd5e1;">Or sign in with custom institutional email:</p>
      <div class="input-group">
        <input type="email" name="email" placeholder="name@${config.orgEmailDomain}" required />
        <button type="submit" class="submit-btn">Continue</button>
      </div>
    </form>

    <div class="footer-note">
      💡 <strong>Production Setup:</strong> To use real Google Cloud OAuth, set <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> in <code>backend/.env</code>.
    </div>

    <a href="${config.frontendUrl}/login" class="back-link">← Return to Login</a>
  </div>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
    return;
  }

  // In production if not configured:
  res.redirect(
    `${config.frontendUrl}/login?error=google_auth_failed&msg=${encodeURIComponent(
      'Google OAuth is not configured on this server. Please contact system administrator.'
    )}`
  );
};

/**
 * Development simulation login handler.
 * Verifies domain and database registration, then issues JWT and redirects to frontend.
 */
export const devGoogleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawEmail = (req.query.email as string || req.body?.email || '').trim().toLowerCase();

    if (!rawEmail) {
      res.redirect(`${config.frontendUrl}/login?error=google_auth_failed&msg=${encodeURIComponent('No email provided.')}`);
      return;
    }

    // Domain check
    if (!rawEmail.endsWith(`@${config.orgEmailDomain}`)) {
      googleAuthFailure(
        req,
        res,
        new Error(`DOMAIN_RESTRICTED: Only @${config.orgEmailDomain} Google accounts are allowed.`)
      );
      return;
    }

    // Check that user is registered in the database
    const user = await userRepository.findByEmail(rawEmail);
    if (!user) {
      googleAuthFailure(
        req,
        res,
        new Error(`NOT_REGISTERED: Your email (${rawEmail}) is not registered in the database. Access is permitted for registered accounts only.`)
      );
      return;
    }

    // Issue standard JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    (req as any).user = { user, token };
    googleAuthCallback(req, res);
  } catch (err: any) {
    googleAuthFailure(req, res, err);
  }
};

/**
 * Callback after Google returns the user (or after devGoogleLogin).
 * Reads the JWT + user and redirects to the frontend callback.
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
 * Called when Google authentication fails (e.g. domain restriction or unregistered account).
 * Redirects to the login page with a human-readable error message.
 */
export const googleAuthFailure = (req: Request, res: Response, err?: any): void => {
  const errMsg = err?.message || '';

  if (errMsg.includes('NOT_REGISTERED')) {
    const msg = encodeURIComponent(
      'Access Denied: Your Google account is not registered in the database. Only pre-registered users can access the platform.'
    );
    res.redirect(`${config.frontendUrl}/login?error=not_registered&msg=${msg}`);
    return;
  }

  if (errMsg.includes('DOMAIN_RESTRICTED')) {
    const msg = encodeURIComponent(
      `Only @${config.orgEmailDomain} Google accounts are permitted. Please sign in with your institutional email.`
    );
    res.redirect(`${config.frontendUrl}/login?error=domain_restricted&msg=${msg}`);
    return;
  }

  const msg = encodeURIComponent(errMsg || 'Google authentication failed. Please try again.');
  res.redirect(`${config.frontendUrl}/login?error=google_auth_failed&msg=${msg}`);
};
