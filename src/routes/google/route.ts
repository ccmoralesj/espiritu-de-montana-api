// src/routes/googleRoutes.ts
import express from 'express';
import { listAccounts, listLocations, fetchReviews } from '../../services/googleService';
const router = express.Router();

router.get('/accounts-locations', async (req, res) => {
  try {
    const accounts = await listAccounts();
    const data = await Promise.all(accounts.map(async (acct: any) => {
      const locs = await listLocations(acct.name!);
      return { account: acct, locations: locs };
    }));
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Ya listo para recibir accountId & locationId, y luego fetch reviews
router.get('/reviews/:accountId/:locationId', async (req, res) => {
  try {
    const reviews = await fetchReviews(req.params.accountId, req.params.locationId);
    res.json(reviews);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
