import { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { sendSuccess, sendError } from '../utils/responseUtils.js';

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required.', 400);
    }

    const result = await authService.login({ email, password });

    return sendSuccess(
      res,
      { user: result.user, token: result.token },
      'Login successful'
    );
  } catch (err: any) {
    const status = err.statusCode || 500;
    const msg = status < 500 ? err.message : 'Server error during login. Please try again.';
    return sendError(res, msg, status);
  }
};

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, department, rollNumber, batch, phone, cgpa } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required.', 400);
    }

    const result = await authService.register({
      name,
      email,
      password,
      department: department || 'Computer Science',
      rollNumber,
      batch,
      phone,
      cgpa: cgpa ? Number(cgpa) : undefined,
    });

    return sendSuccess(
      res,
      { user: result.user, token: result.token },
      'Registration successful. Welcome to CampusAI!',
      201
    );
  } catch (err: any) {
    const status = err.statusCode || 500;
    const msg = status < 500 ? err.message : 'Server error during registration. Please try again.';
    return sendError(res, msg, status);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user?.id) {
      return sendError(res, 'Not authenticated.', 401);
    }

    const user = await authService.getMe(req.user.id);
    return sendSuccess(res, { user }, 'Session restored successfully');
  } catch (err: any) {
    const status = err.statusCode || 500;
    const msg = status < 500 ? err.message : 'Server error fetching user profile.';
    return sendError(res, msg, status);
  }
};

export const logout = async (_req: Request, res: Response): Promise<Response> => {
  // With stateless JWT, logout is client-side (clear token).
  // This endpoint is provided for future server-side token invalidation (blocklist).
  return sendSuccess(res, null, 'Logged out successfully.');
};
