import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res
      .status(401)
      .json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } });
    return;
  }
  try {
    const token = auth.slice(7);
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev-secret'
    );
    (req as Request & { user: unknown }).user = payload;
    next();
  } catch {
    res
      .status(401)
      .json({ error: { message: 'Invalid token', code: 'INVALID_TOKEN' } });
  }
}
