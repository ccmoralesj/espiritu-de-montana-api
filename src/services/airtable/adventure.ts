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
  { view }: { view?: string } = {}
): Promise<AirtableRecord | null> {
  if (!slug) return null;
  const normalized = slug.toString().trim().toLowerCase();

  // arma la fórmula con JSON.stringify para escapar correctamente
  const quoted = JSON.stringify(normalized);
  const formula = `LOWER(TRIM({slug})) = ${quoted}`;

  logger.debug({ slug: normalized, view, formula }, `Fetching adventure by slug`);

  try {
    const records = await airtableDB(TABLE_NAMES.ADVENTURES)
      .select({
        // deja view opcional: si quieres buscar en toda la tabla no le pases view
        ...(view ? { view } : {}),
        filterByFormula: formula,
        maxRecords: 1,
      })
      .firstPage();

    if (!records || records.length === 0) {
      logger.warn({ slug: normalized }, `No record found matching slug`);
      return null;
    }

    const record = records[0];
    return { id: record.id, fields: record.fields };
  } catch (err) {
    logger.error({ err, slug: normalized, formula }, "Error fetching adventure by slug");
    throw err;
  }
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