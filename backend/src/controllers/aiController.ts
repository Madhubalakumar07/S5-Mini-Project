import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { aiService } from '../services/aiService.js';
import { sendSuccess, sendError } from '../utils/responseUtils.js';
import { getAllCompanyProfiles, COMPANY_PROFILES } from '../data/companyPlacementData.js';
import { PDFParse } from 'pdf-parse';

/**
 * Robust extraction of text from PDF / document buffer
 */
async function extractTextFromBuffer(buffer: Buffer): Promise<string> {
  try {
    if (typeof (PDFParse as any) === 'function') {
      try {
        const parser = new (PDFParse as any)(buffer);
        if (typeof parser.load === 'function') {
          await parser.load();
        }
        if (typeof parser.getText === 'function') {
          const res = await parser.getText();
          if (res && typeof res === 'string' && res.trim().length > 10) {
            return res.trim();
          }
        }
      } catch (err1) {
        try {
          const direct = await (PDFParse as any)(buffer);
          if (direct && typeof direct.text === 'string' && direct.text.trim().length > 10) {
            return direct.text.trim();
          }
        } catch (err2) {
          // fallback to text stream decode below
        }
      }
    }
  } catch (e) {
    // continue to fallback
  }

  // Fallback: extract ASCII / UTF-8 strings from binary document buffer
  const raw = buffer.toString('utf-8');
  const streamMatches = raw.match(/\(([^()]+)\)\s*Tj/g);
  if (streamMatches && streamMatches.length > 0) {
    const extracted = streamMatches
      .map(b => b.replace(/[()]/g, '').replace(/Tj/g, '').trim())
      .filter(Boolean)
      .join(' ');
    if (extracted.length > 20) return extracted;
  }

  // Clean printable characters
  const clean = raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
    .replace(/(\r\n|\n|\r)/gm, '\n')
    .replace(/\s+/g, ' ')
    .trim();

  return clean;
}

export const chatWithAI = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || 'usr_student_1';
    const { message, history = [], companyId, studyMaterialContext } = req.body;

    if (!message || typeof message !== 'string') {
      return sendError(res, 'A message string is required.', 400);
    }

    const result = await aiService.processChat(
      userId,
      message,
      history,
      companyId,
      studyMaterialContext
    );

    return sendSuccess(res, result, 'AI response generated successfully');
  } catch (err: any) {
    return sendError(res, err.message || 'Error processing AI chat.', 500);
  }
};

export const summarizeStudyMaterial = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    let combinedText = '';
    let documentName = req.body.documentName || '';
    let topicContext = req.body.topicContext || '';

    // Handle multiple uploaded files or single file
    const uploadedFiles = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);

    if (uploadedFiles && uploadedFiles.length > 0) {
      const fileNames: string[] = [];
      const extractedChunks: string[] = [];

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        fileNames.push(file.originalname);
        try {
          const text = await extractTextFromBuffer(file.buffer);
          if (text && text.trim().length > 0) {
            extractedChunks.push(`=== Document [${i + 1}/${uploadedFiles.length}]: ${file.originalname} ===\n${text}`);
          }
        } catch (fileErr) {
          const fallback = file.buffer.toString('utf-8');
          extractedChunks.push(`=== Document [${i + 1}/${uploadedFiles.length}]: ${file.originalname} ===\n${fallback}`);
        }
      }

      documentName = fileNames.length === 1 ? fileNames[0] : `${fileNames.length} Documents (${fileNames.slice(0, 2).join(', ')}${fileNames.length > 2 ? '...' : ''})`;
      combinedText = extractedChunks.join('\n\n');
    } else if (req.body.text) {
      combinedText = req.body.text;
      documentName = documentName || 'Pasted Study Notes';
    } else {
      return sendError(res, 'Please provide either PDF file(s) or document text to summarize.', 400);
    }

    if (!combinedText || combinedText.trim().length < 5) {
      return sendError(res, 'The provided documents are empty or unreadable.', 400);
    }

    const summary = await aiService.summarizeStudyMaterial(
      combinedText,
      documentName,
      topicContext
    );

    return sendSuccess(res, summary, 'Study materials summarized successfully');
  } catch (err: any) {
    return sendError(res, err.message || 'Error summarizing study materials.', 500);
  }
};

export const analyzeCompany = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || 'usr_student_1';
    const { companyId } = req.body;

    if (!companyId || typeof companyId !== 'string') {
      return sendError(res, 'companyId is required.', 400);
    }

    const analysis = await aiService.analyzeCompanyForStudent(userId, companyId);
    return sendSuccess(res, analysis, `Analysis for ${analysis.company.name} generated successfully`);
  } catch (err: any) {
    return sendError(res, err.message || 'Error analyzing company.', 500);
  }
};

export const getCompaniesList = async (_req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const companies = getAllCompanyProfiles();
    return sendSuccess(res, { companies }, 'Company list retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Error retrieving companies.', 500);
  }
};

export const getCompanyDetails = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const company = COMPANY_PROFILES[id.toLowerCase()];

    if (!company) {
      return sendError(res, `Company with id "${id}" not found.`, 404);
    }

    return sendSuccess(res, { company }, 'Company details retrieved');
  } catch (err: any) {
    return sendError(res, err.message || 'Error retrieving company details.', 500);
  }
};
