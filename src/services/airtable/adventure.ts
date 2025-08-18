import { airtableDB } from ".";
import logger from "../../utils/logger";
import { AdventureRecord, FetchAdventureProps, TABLE_NAMES } from "./consts";
import { buildDateFilter } from "./utils";

export async function fetchAdventures({
  view = 'Grid view',
  from = 'TODAY()',
  to,
}: FetchAdventureProps = {}
): Promise<AdventureRecord[]> {
  logger.debug({ view , from, to }, 'Fetching adventures with date filter');
  const formula = buildDateFilter(from, to);

  return new Promise((resolve, reject) => {
    const all: AdventureRecord[] = [];
    airtableDB(TABLE_NAMES.ADVENTURES)
      .select({
        view,
        ...(formula ? { filterByFormula: formula } : {}),
      })
      .eachPage(
        (records, fetchNextPage) => {
          all.push(...records);
          fetchNextPage();
        },
        err => (err ? reject(err) : resolve(all))
      );
  });
}

export async function fetchAdventureById(
  id: string
): Promise<AdventureRecord | null> {
  logger.debug({ id }, `Fetching adventure by id`);

  const record = await airtableDB(TABLE_NAMES.ADVENTURES).find(id);
  if (!record) return null;

  // Solo retorna los datos útiles al API
  return {
    id: record.id,
    fields: record.fields,
  };
}

export async function fetchAdventureBySlug(
  slug: string,
  { view = "Grid view" }: { view?: string } = {}
): Promise<AdventureRecord | null> {
  const normalized = slug.toLowerCase();

  logger.debug({ slug: normalized, view }, `Fetching adventure by slug`);

  const all: any[] = [];
  await airtableDB(TABLE_NAMES.ADVENTURES)
    .select({
      view,
      filterByFormula: `LOWER({slug}) = "${normalized}"`,
      maxRecords: 1,
    })
    .eachPage(
      (records, fetchNextPage) => {
        all.push(...records);
        fetchNextPage();
      },
      err => { if (err) throw err; }
    );

  if (!all.length) {
    logger.warn(`No record found matching slug "${normalized}"`);
    return null;
  }

  const record = all[0];
  return { id: record.id, fields: record.fields };
}
