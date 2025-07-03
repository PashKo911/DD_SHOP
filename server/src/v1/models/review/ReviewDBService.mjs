import Review from './Review.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class ReviewsDBService extends MongooseCRUDManager {
	static async getReviews(req, res) {
		try {
		} catch (error) {}
	}
}

export default new ReviewsDBService(Review)
