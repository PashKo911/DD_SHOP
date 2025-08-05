import Review from './Review.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class ReviewsDBService extends MongooseCRUDManager {}

export default new ReviewsDBService(Review)
