export const TABLE_NAMES = {
  GOOGLE_REVIEWS: 'GoogleReviews',
  ADVENTURES: 'Aventuras Y Experiencias',
  ITEMS_AVENTURAS: 'Ítems de Aventuras'
}

export interface AirtableRecord {
  id: string;
  fields: { [key: string]: any };
}

export interface FetchAdventureProps {
  view?: string;
  from?: string;
  to?: string;
}