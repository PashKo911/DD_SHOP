import User from './User.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import { errorCodes } from '../../../../constants/errorCodes.mjs'

class UsersDBService extends MongooseCRUDManager {
	async getList(filters) {
		try {
			const res = await super.getList(filters, { password: 0 }, ['type'])
			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get users', {
				cause: err,
				code: errorCodes.DATABASE_ERROR,
			})
		}
	}

	async updateUser(userId, data) {
		try {
			const res = await User.findByIdAndUpdate(userId, data, {
				new: true,
				select: '-password -googleId',
			}).populate('type')

			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(400, 'Failed to update user', {
				cause: err,
				code: errorCodes.DATABASE_ERROR,
			})
		}
	}

	async getById(id, projection = null) {
		try {
			const user = await super.getById(id, projection, ['type'])
			return user
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get user by id', {
				cause: err,
				code: errorCodes.DATABASE_ERROR,
			})
		}
	}

	async findOne(filters = {}, projection = null) {
		try {
			const user = await super.findOne(filters, projection, ['type'])
			return user
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to find user', {
				cause: err,
				code: errorCodes.DATABASE_ERROR,
			})
		}
	}
}

export default new UsersDBService(User)
