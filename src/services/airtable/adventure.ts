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