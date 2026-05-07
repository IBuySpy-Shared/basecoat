import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/api/v1/me', requireAuth, (req: Request, res: Response) => {
  res.json({ data: (req as Request & { user: unknown }).user });
});

export default router;
