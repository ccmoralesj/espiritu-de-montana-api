// src/server.ts
import express from 'express';
import cors from 'cors';
import pinoHTTP from 'pino-http';
import cron from 'node-cron';
import logger from './utils/logger';

import reviewsRouter from './routes/reviews/route';
import googleRouter from './routes/google/route';
import adventureRouter from './routes/adventures/route';
import oauthRouter from './routes/oauth/route';
import { getConfig } from './config/env';
// import syncReviewsJob from './jobs/syncReviews';

const app = express();

const allowed = getConfig('CORS_ORIGIN')
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(new Error('CORS no permitido'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
}));

app.use(express.json());
app.use(pinoHTTP({ logger }));

// Health check
app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// API routes
app.use(oauthRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/google', googleRouter);
app.use('/api/adventures', adventureRouter);

// Schedule cron job: sincronización reviews cada día 1 de cada mes a las 00:00
// cron.schedule('0 0 1 * *', () => {
//   logger.info('🕒 Ejecución del job: syncReviews');
//   syncReviewsJob()
//     .then(() => logger.info('✅ syncReviews completado'))
//     .catch(err => logger.error({ err }, 'syncReviews fallo'));
// });

// Start servidor
const PORT = getConfig('PORT')
app.listen(PORT, () => logger.info(`Server corriendo en puerto ${PORT}`));

export default app;
