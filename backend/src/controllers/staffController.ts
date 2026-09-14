import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { staffService } from '../services/staffService.js';
import { sendSuccess, sendError } from '../utils/responseUtils.js';
import { userRepository } from '../repositories/mockUserRepository.js';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const user = await userRepository.findById(req.user!.id);
    if (!user) return sendError(res, 'Staff profile not found.', 404);
    return sendSuccess(res, { user: userRepository.sanitizeUser(user) }, 'Staff profile retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getDashboard = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const data = await staffService.getDashboard(req.user!.id);
    return sendSuccess(res, data, 'Staff dashboard data retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getStudents = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { riskLevel, department, search } = req.query as Record<string, string | undefined>;
    const data = await staffService.getStudentsList({ riskLevel, department, search });
    return sendSuccess(res, data, 'Students list retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getStudentById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { studentId } = req.params;
    const data = await staffService.getStudentById(studentId);
    return sendSuccess(res, data, 'Student data retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getAttendance = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const data = await staffService.getAttendanceSessions();
    return sendSuccess(res, data, 'Attendance sessions retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const saveAttendance = async (req: Request, res: Response): Promise<Response> => {
  try {
    const session = req.body;
    if (!session || !session.subject || !session.entries) {
      return sendError(res, 'Invalid attendance session data.', 400);
    }
    const saved = await staffService.saveAttendanceSession(session);
    return sendSuccess(res, saved, 'Attendance session saved', 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getAcademics = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { subject } = req.query as { subject?: string };
    const data = await staffService.getAcademicMarks(subject);
    return sendSuccess(res, data, 'Academic marks retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const saveMark = async (req: Request, res: Response): Promise<Response> => {
  try {
    const marks = Array.isArray(req.body) ? req.body : [req.body];
    const saved = await staffService.saveAcademicMarks(marks);
    return sendSuccess(res, saved, 'Marks saved', 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getPlacement = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const data = await staffService.getPlacementRoster();
    return sendSuccess(res, data, 'Placement roster retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getSupport = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { status } = req.query as { status?: string };
    const data = await staffService.getSupportCases(status);
    return sendSuccess(res, data, 'Support cases retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const updateSupport = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await staffService.updateSupportCase(id, updateData);
    return sendSuccess(res, updated, 'Support case updated');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getAnnouncements = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const data = await staffService.getAnnouncements();
    return sendSuccess(res, data, 'Announcements retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const createAnnouncement = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { title, description, audience, category, pinned } = req.body;
    if (!title || !description || !audience || !category) {
      return sendError(res, 'Title, description, audience, and category are required.', 400);
    }
    const authorName = req.user?.name || 'Staff';
    const announcement = await staffService.createAnnouncement({
      title,
      description,
      audience,
      category,
      pinned: pinned ?? false,
      author: authorName,
      date: new Date().toISOString().split('T')[0],
    });
    return sendSuccess(res, announcement, 'Announcement created', 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};

export const getReports = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const data = await staffService.getReports();
    return sendSuccess(res, data, 'Reports retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Server error.', err.statusCode || 500);
  }
};
