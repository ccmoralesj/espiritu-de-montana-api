// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino';
import pinoHTTP from 'pino-http';
import cron from 'node-cron';

// import reviewsRouter from './routes/reviews.route';
// import syncReviewsJob from './jobs/sync.reviews';

dotenv.config();
const PORT = process.env.PORT ?? 4000;
const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});
const app = express();

const allowed = process.env.CORS_ORIGIN?.split(',') || [];
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
// app.use('/api/reviews', reviewsRouter);

// Schedule cron job: sincronización reviews cada día 1 de cada mes a las 00:00
// cron.schedule('0 0 1 * *', () => {
//   logger.info('🕒 Ejecución del job: syncReviews');
//   syncReviewsJob()
//     .then(() => logger.info('✅ syncReviews completado'))
//     .catch(err => logger.error({ err }, 'syncReviews fallo'));
// });

// Start servidor
app.listen(PORT, () => logger.info(`Server corriendo en puerto ${PORT}`));

export default app;
