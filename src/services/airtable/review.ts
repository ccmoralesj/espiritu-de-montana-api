import { airtableDB } from ".";
import { TABLE_NAMES } from "./consts";


export async function upsertReview(review: any) {
  const existing = await airtableDB(TABLE_NAMES.GOOGLE_REVIEWS).select({
    filterByFormula: `{google_review_id} = '${review.google_review_id}'`,
    maxRecords: 1
  }).firstPage();

  const payload = {
    google_review_id: review.google_review_id,
    author: review.author,
    rating: review.rating,
    text: review.text,
    time: review.time,
    synced_at: new Date().toISOString()
  };

  return existing[0]
    ? airtableDB('Reviews').update(existing[0].id, payload)
    : airtableDB('Reviews').create(payload);
}

export async function getAllReviews() {
  const all: any[] = [];
  await airtableDB(TABLE_NAMES.GOOGLE_REVIEWS).select({}).eachPage((records, next) => {
    records.forEach(r => all.push({ id: r.id, ...r.fields }));
    next();
  });
  return all;
}
