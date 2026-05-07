import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export interface AppError extends Error {
  status?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction): void {
  const status = err.status ?? 500;
  const message = err.message || 'Internal Server Error';

  logger.error('Unhandled error', { status, message, stack: err.stack });

  res.status(status).json({ error: message, status });
}
