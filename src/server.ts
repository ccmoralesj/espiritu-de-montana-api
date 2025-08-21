import express from 'express';
import cors from 'cors';
import pinoHTTP from 'pino-http';
import rateLimit from 'express-rate-limit';
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

// Middlewares para confiar en proxy si estás detrás de un LB (importante)
app.set('trust proxy', 1);

// Limite básico para la API pública
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 60 requests por IP por ventana
  standardHeaders: true, // Return RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: { error: "Too many requests, please try again later." },
  handler: (req, res, next, options) => {
    const retrySecs = Math.ceil(options.windowMs / 1000);
    logger.warn({ ip: req.ip, path: req.originalUrl }, 'Rate limit hit');
    res.setHeader("Retry-After", retrySecs);
    res.status(429).json({
      error: "Too many requests, please try again later.",
      retryAfter: retrySecs
    });
  }
});

app.use(express.json());
app.use(pinoHTTP({ logger }));
app.use('/api/', apiLimiter);



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
