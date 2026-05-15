import Order from './Order.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../errors/HttpError.mjs'

class OrdersDBService extends MongooseCRUDManager {
	getByUserAndCourseIds(userId, courseId, { lean = false } = {}) {
		try {
			const query = this.model.findOne({ userId, courseId })

			const res = lean ? query.lean() : query
			return res
		} catch (error) {
			if (error instanceof HttpError) throw error
			throw new HttpError(500, 'Failed to get order by user and course ids', {
				cause: error,
				code: 'DATABASE_ERROR',
			})
		}
	}
}

export default new OrdersDBService(Order)
