import User from './User.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import { errorCodes } from '../../../../config/errorCodes.mjs'

class UsersDBService extends MongooseCRUDManager {
	async getList(filters) {
		try {
			const res = await super.getList(filters, { password: 0 }, ['type'])
			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get users', { cause: err, code: errorCodes.DATABASE_ERROR })
		}
	}
	async getById(id) {
		try {
			const document = await super.getById(id, { googleId: 0, password: 0 }, ['type'])
			return document
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, `Failed to get user with id:${id}`, {
				cause: err,
				code: errorCodes.DATABASE_ERROR,
			})
		}
	}
	async findOne(filters) {
		try {
			const document = await super.findOne(filters, {}, ['type'])
			return document
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get user by filters', {
				cause: err,
				code: errorCodes.DATABASE_ERROR,
			})
		}
	}
}

export default new UsersDBService(User)
