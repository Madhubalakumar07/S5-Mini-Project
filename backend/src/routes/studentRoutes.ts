import { Router } from 'express';
import {
  getProfile,
  getDashboard,
  getAttendance,
  getAcademics,
  getPlacement,
} from '../controllers/studentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { requireStudent } from '../middleware/roleMiddleware.js';

const router = Router();

// All student routes require: valid JWT AND STUDENT role
router.use(authenticateUser, requireStudent);

router.get('/profile', getProfile);
router.get('/dashboard', getDashboard);
router.get('/attendance', getAttendance);
router.get('/academics', getAcademics);
router.get('/placement', getPlacement);

export default router;
