import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseUtils.js';

/**
 * Centralized Express global error handling middleware.
 * Formats errors consistently without leaking raw stack traces in responses.
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response => {
  console.error(`[Error] ${req.method} ${req.url}:`, err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
};
