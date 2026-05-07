import winston from 'winston';
import 'dotenv/config';

const { LOG_LEVEL = 'info', NODE_ENV = 'development' } = process.env;

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format:
    NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
            return `${timestamp} [${level}]: ${message}${metaStr}`;
          }),
        ),
  transports: [new winston.transports.Console()],
});

export default logger;
