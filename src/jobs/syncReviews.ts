import { fetchReviews } from '../services/googleService';
import { upsertReview } from '../services/airtable/review';
import { getConfig } from '../config/env';

export default async function syncReviewsJob() {
  const accountID = getConfig('GOOGLE_ACCOUNT_ID')
  const locationID = getConfig('GOOGLE_LOCATION_ID')
  if (!accountID || !locationID) throw new Error('Sin ACCOUNT_ID o LOCATION_ID');

  const reviews = await fetchReviews(accountID, locationID);
  for (const r of reviews) {
    await upsertReview({
      google_review_id: r.reviewId || r.name,
      author: r.reviewer?.displayName,
      rating: r.starRating,
      text: r.comment,
      time: r.createTime
    });
  }
}
