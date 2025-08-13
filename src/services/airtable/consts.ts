export const TABLE_NAMES = {
  GOOGLE_REVIEWS: 'GoogleReviews',
  ADVENTURES: 'Aventuras Y Experiencias'
}

export interface AdventureRecord {
  id: string;
  fields: { [key: string]: any };
}

export interface FetchAdventureProps {
  view?: string;
  from?: string;
  to?: string;
}