import { Router } from 'express';
import multer from 'multer';
import {
  chatWithAI,
  summarizeStudyMaterial,
  analyzeCompany,
  getCompaniesList,
  getCompanyDetails,
} from '../controllers/aiController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

// Setup multer memory storage for PDF/document uploads (max 50MB total)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

const router = Router();

// All AI endpoints require authenticated user token
router.use(authenticateUser);

// AI Chatbot
router.post('/chat', chatWithAI);

// PDF & Study Material Summarizer (supports single or multiple file upload OR json payload)
router.post('/summarize-pdf', upload.any(), summarizeStudyMaterial);

// Company Placement & Recruitment Intelligence
router.post('/analyze-company', analyzeCompany);
router.get('/companies', getCompaniesList);
router.get('/companies/:id', getCompanyDetails);

export default router;
