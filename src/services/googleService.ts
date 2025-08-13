import { google, mybusinessaccountmanagement_v1, mybusinessbusinessinformation_v1 } from 'googleapis';
import { getConfig } from '../config/env';
import logger from '../utils/logger';

const googleClientId = getConfig('GOOGLE_CLIENT_ID')
const googleSecret = getConfig('GOOGLE_CLIENT_SECRET')
const googleRefreshToken = getConfig('GOOGLE_REFRESH_TOKEN')

const oauth2Client = new google.auth.OAuth2(
  googleClientId,
  googleSecret
);

oauth2Client.setCredentials({ refresh_token: googleRefreshToken });

google.options({ auth: oauth2Client });

// Clientes por API
const mgmt = google.mybusinessaccountmanagement('v1');        // cuentas
const info = google.mybusinessbusinessinformation('v1');      // locations

export async function getAccessToken() {
  const res = await oauth2Client.getAccessToken();
  return typeof res === 'string' ? res : res?.token;
}

export async function listAccounts(): Promise<mybusinessaccountmanagement_v1.Schema$Account[]> {
  const res = await mgmt.accounts.list({});
  return res.data.accounts ?? [];
}

export async function listLocations(
  accountId: string
): Promise<mybusinessbusinessinformation_v1.Schema$Location[]> {
  const parent = `accounts/${accountId}`;
  const res = await info.accounts.locations.list({
    parent,
    pageSize: 100,
    // Incluye los campos que realmente vas a usar
    readMask: 'name,title,storeCode,websiteUri,phoneNumbers,storefrontAddress,metadata,openInfo'
  });
  return res.data.locations ?? [];
}

export async function fetchReviews(accountId: string, locationId: string) {
  const token = await getAccessToken();
  const url = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  return data.reviews ?? [];
}
