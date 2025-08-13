import Airtable from 'airtable';
import { getConfig } from '../../config/env';

const airtableAPIKey = getConfig('AIRTABLE_API_KEY')
const airtableBaseId = getConfig('AIRTABLE_BASE_ID')

export const airtableDB = new Airtable({
  apiKey: airtableAPIKey
}).base(airtableBaseId);

