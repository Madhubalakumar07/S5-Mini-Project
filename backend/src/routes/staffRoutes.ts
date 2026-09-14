import { Router } from 'express';
import {
  getProfile,
  getDashboard,
  getStudents,
  getStudentById,
  getAttendance,
  saveAttendance,
  getAcademics,
  saveMark,
  getPlacement,
  getSupport,
  updateSupport,
  getAnnouncements,
  createAnnouncement,
  getReports,
} from '../controllers/staffController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { requireStaff } from '../middleware/roleMiddleware.js';

const router = Router();

// All staff routes require: valid JWT AND STAFF role
router.use(authenticateUser, requireStaff);

router.get('/profile', getProfile);
router.get('/dashboard', getDashboard);
router.get('/students', getStudents);
router.get('/students/:studentId', getStudentById);
router.get('/attendance', getAttendance);
router.post('/attendance', saveAttendance);
router.get('/academics', getAcademics);
router.post('/academics', saveMark);
router.get('/placement', getPlacement);
router.get('/support', getSupport);
router.patch('/support/:id', updateSupport);
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.get('/reports', getReports);

export default router;
