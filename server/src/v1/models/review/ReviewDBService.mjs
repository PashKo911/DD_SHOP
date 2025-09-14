import Review from './Review.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import { errorCodes } from '../../../../config/errorCodes.mjs'

class ReviewsDBService extends MongooseCRUDManager {
	async getRandomReviews(limit, minRating) {
		try {
			const match = {}

			if (minRating) {
				match.rating = { $gte: minRating }
			}

			const populateFields = [
				{
					from: 'users',
					localField: 'author',
					foreignField: '_id',
					as: 'author',
				},
			]
			const reviews = await super.getRandomList({ limit, match, populateFields })
			return reviews
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get reviews', { cause: err, code: errorCodes.DATABASE_ERROR })
		}
	}
}

export default new ReviewsDBService(Review)
