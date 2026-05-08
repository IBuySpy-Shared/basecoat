import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import passport from './config/passport';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import healthRouter from './routes/health';
import repositoriesRouter from './routes/repositories';
import scansRouter from './routes/scans';
import authRouter from './routes/auth';
import meRouter from './routes/me';

const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.', code: 'RATE_LIMITED' },
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.', code: 'RATE_LIMITED' },
});

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'dev-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
      },
    })
  );
  app.use(passport.initialize());

  app.use(requestLogger);

  app.use('/health', healthRouter);
  app.use('/api/v1', defaultLimiter, repositoriesRouter);
  app.use('/api/v1', defaultLimiter, scansRouter);
  app.use(authRouter);
  app.use(strictLimiter, meRouter);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found', status: 404 });
  });

  app.use(errorHandler);

  return app;
}
