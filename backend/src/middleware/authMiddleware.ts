import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/tokenUtils.js';
import { sendError } from '../utils/responseUtils.js';
import { JwtPayload } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware that validates the Bearer JWT token in Authorization header.
 * Attaches decoded user claims to req.user.
 */
export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication token missing or invalid format. Please log in.', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 'Access token is required.', 401);
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please log in again.', 401);
    }
    return sendError(res, 'Invalid authentication token.', 401);
  }
};

// Backwards compatibility alias
export const authenticateToken = authenticateUser;
export type AuthRequest = AuthenticatedRequest;
