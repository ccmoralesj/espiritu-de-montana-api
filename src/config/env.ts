import dotenv from 'dotenv';
import path from 'path';

const envFile = (process.env.NODE_ENV === 'production') ? '.env' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });


export interface NameToType {
  // APP
  NODE_ENV: 'production' | 'development';
  PORT: number;
  API_BASE_URL: string;
  REDIS_URL: string;
  CORS_ORIGIN: string[];
  // AIRTABLE
  AIRTABLE_BASE_ID: string;
  AIRTABLE_API_KEY: string;
  // GOOGLE
  GOOGLE_ACCOUNT_ID: string;
  GOOGLE_LOCATION_ID: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REFRESH_TOKEN: string;
  GOOGLE_OAUTH_REDIRECT_URI: string;
}

export function getConfig<T extends keyof NameToType>(name: T): NameToType[T];
export function getConfig(name: string): string | string[] | number | boolean | null {
  const val = process.env[name];

  if (!val && process.env.NODE_ENV !== 'test') {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }

  switch (name) {
    case 'NODE_ENV':
      return val || 'development';
    case 'PORT':
      return Number.parseInt(val ?? '4000', 10);
    case 'CORS_ORIGIN':
      return val ? val.split(',') : [];
    default:
      return val || '';
    
  }

  return val || null;
}
