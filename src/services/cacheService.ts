import { createClient } from 'redis';
import { getConfig } from '../config/env';
const client = createClient({ url: getConfig('REDIS_URL')});
client.connect().catch(console.error);

export async function get(key: string) {
  return client.get(key);
}
export async function set(key: string, value: string, exMode: string, ex: number) {
  return client.set(key, value, { [exMode]: ex });
}
export default { get, set };
