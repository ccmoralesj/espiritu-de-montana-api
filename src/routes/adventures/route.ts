// src/adventures/routes.ts
import express from 'express';
import { fetchAdventures } from '../../services/airtable/adventure';
import { Adventure } from '../../types/adventure';
import { mapRecordToAdventure, upcomingAndSorted } from '../../services/airtable/utils';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const adventureRecords = await fetchAdventures();
    const adventures: Adventure[] = adventureRecords.map(mapRecordToAdventure);
    const sortedAdventures = upcomingAndSorted(adventures)
    res.json(sortedAdventures);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
