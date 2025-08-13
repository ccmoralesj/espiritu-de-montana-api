import express from 'express';
// import cache from '../../services/cacheService';
import { getAllReviews } from '../../services/airtable/review';

const router = express.Router();
router.get('/', async (req, res) => {
  // const cacheKey = 'reviews:all';
  // const cached = await cache.get(cacheKey);
  // if (cached) return res.json(JSON.parse(cached));

  const rows = await getAllReviews();
  // await cache.set(cacheKey, JSON.stringify(rows), 'EX', 300); // 5m
  res.json(rows);
});
export default router;
