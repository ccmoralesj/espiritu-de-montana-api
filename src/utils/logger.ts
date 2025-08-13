// src/utils/logger.ts
import pino from 'pino';
import { getConfig } from '../config/env';

const NODE_ENV = getConfig('NODE_ENV') 

const logger = pino({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  transport: NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined
});

export default logger;
