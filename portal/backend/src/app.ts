import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import healthRouter from './routes/health';
import repositoriesRouter from './routes/repositories';
import scansRouter from './routes/scans';
import authRouter from './routes/auth';
import meRouter from './routes/me';

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
    })
  );
  app.use(passport.initialize());

  app.use(requestLogger);

  app.use('/health', healthRouter);
  app.use('/api/v1', repositoriesRouter);
  app.use('/api/v1', scansRouter);
  app.use(authRouter);
  app.use(meRouter);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found', status: 404 });
  });

  app.use(errorHandler);

  return app;
}
