import { airtableDB } from ".";
import { IncludeItem } from "../../types/adventure";
import logger from "../../utils/logger";
import { AirtableRecord, FetchAdventureProps, TABLE_NAMES } from "./consts";
import { buildDateFilter } from "./utils";

export async function fetchAdventures({
  view = 'Grid view',
  from = 'TODAY()',
  to,
}: FetchAdventureProps = {}
): Promise<AirtableRecord[]> {
  logger.debug({ view , from, to }, 'Fetching adventures with date filter');
  const formula = buildDateFilter(from, to);

  return new Promise((resolve, reject) => {
    const all: AirtableRecord[] = [];
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
): Promise<AirtableRecord | null> {
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
): Promise<AirtableRecord | null> {
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

export async function fetchAdventureItems(recordIds: string[]): Promise<AirtableRecord[]> {
  if (!recordIds || recordIds.length === 0) return [];

  // Construye el OR(RECORD_ID()='id1', RECORD_ID()='id2', ...)
  const formula = `OR(${recordIds
    .map((id) => `RECORD_ID()='${id}'`)
    .join(",")})`;

  const records = await airtableDB(TABLE_NAMES.ITEMS_AVENTURAS)
    .select({
      filterByFormula: formula,
    })
    .all();

  // Retorna los fields + id
  return records.map((record) => ({
    id: record.id,
    fields: record.fields,
  }));
}