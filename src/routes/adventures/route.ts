// src/adventures/routes.ts
import express from 'express';
import { fetchAdventureById, fetchAdventureBySlug, fetchAdventures } from '../../services/airtable/adventure';
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

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const adventureRecord = await fetchAdventureById(id);
    if (!adventureRecord) return res.status(404).json({ error: 'Not found' });
    const adventureMapped = mapRecordToAdventure(adventureRecord)
    res.json(adventureMapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/slug/resolve', async (req, res) => {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'slug param required' });

  const adventureRecord = await fetchAdventureBySlug(slug as string);
  if (!adventureRecord) return res.status(404).json({ error: 'Not found' });
  const adventureMapped = mapRecordToAdventure(adventureRecord)

  res.json(adventureMapped);
});

export default router;
