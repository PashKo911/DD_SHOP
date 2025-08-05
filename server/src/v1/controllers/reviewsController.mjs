import ReviewDBService from '../models/review/ReviewDBService.mjs'

class ReviewsController {
	static async getRandomReviews(req, res, next) {
		try {
			const defaultLimit = 10
			const minRatingLower = 1
			const maxRatingUpper = 5

			const parsedLimit = Number(req.query.limit)
			const parsedMinRating = Number(req.query.minRating)

			const limit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : defaultLimit
			const minRating =
				Number.isInteger(parsedMinRating) &&
				parsedMinRating >= minRatingLower &&
				parsedMinRating <= maxRatingUpper
					? parsedMinRating
					: undefined

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
			const reviews = await ReviewDBService.getRandomList({ limit, match, populateFields })
			res.status(200).json({ reviews })
		} catch (err) {
			next(err)
		}
	}
}

export default ReviewsController
