import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';
import { sendError } from '../utils/responseUtils.js';
import { Role } from '../types/index.js';

/**
 * Role-Based Access Control (RBAC) guard middleware.
 * Verifies that the authenticated user possesses one of the allowed roles.
 */
export const requireRole = (...allowedRoles: (Role | string)[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      return sendError(res, 'Unauthenticated. Access denied.', 401);
    }

    const userRole = (req.user.role || '').toUpperCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

    if (!normalizedAllowed.includes(userRole)) {
      return sendError(
        res,
        `Access denied. This resource requires [${allowedRoles.join(', ')}] role authorization.`,
        403
      );
    }

    return next();
  };
};

/**
 * Convenience middleware: strictly requires STUDENT role.
 */
export const requireStudent = requireRole('STUDENT');

/**
 * Convenience middleware: strictly requires STAFF role.
 */
export const requireStaff = requireRole('STAFF');
