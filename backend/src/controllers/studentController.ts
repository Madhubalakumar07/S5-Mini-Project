import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { studentService } from '../services/studentService.js';
import { sendSuccess, sendError } from '../utils/responseUtils.js';
import { userRepository } from '../repositories/mockUserRepository.js';

/**
 * All student controllers use req.user.id from the verified JWT —
 * never from URL params or query strings — to enforce data isolation.
 */

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user!.id;
    const user = await userRepository.findById(userId);
    if (!user) return sendError(res, 'Student profile not found.', 404);
    return sendSuccess(res, { user: userRepository.sanitizeUser(user) }, 'Profile retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getDashboard = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const data = await studentService.getDashboard(req.user!.id);
    return sendSuccess(res, data, 'Dashboard data retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getAttendance = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const data = await studentService.getAttendance(req.user!.id);
    return sendSuccess(res, data, 'Attendance data retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getAcademics = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const data = await studentService.getAcademics(req.user!.id);
    return sendSuccess(res, data, 'Academic data retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getPlacement = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const data = await studentService.getPlacement(req.user!.id);
    return sendSuccess(res, data, 'Placement data retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};
