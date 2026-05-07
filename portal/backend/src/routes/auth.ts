import { Router, Request, Response } from 'express';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';

const router = Router();

router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: '/login?error=auth_failed',
  }),
  (req: Request, res: Response) => {
    const user = (req as Request & { user: { id: string; username: string; role: string } }).user;
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );
    res.json({
      data: {
        token,
        user: { id: user.id, username: user.username, role: user.role },
      },
    });
  }
);

router.post('/auth/logout', (_req: Request, res: Response) => {
  res.json({ data: { message: 'Logged out successfully' } });
});

export default router;
