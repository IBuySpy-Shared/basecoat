import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import healthRouter from './routes/health';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use(requestLogger);

  app.use('/health', healthRouter);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found', status: 404 });
  });

  app.use(errorHandler);

  return app;
}
