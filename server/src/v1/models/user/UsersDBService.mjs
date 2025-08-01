import User from './User.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'

class UsersDBService extends MongooseCRUDManager {
	async getList(filters) {
		try {
			const res = await super.getList(filters, { password: 0 }, ['type'])
			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get users', err)
		}
	}
	async getById(id) {
		try {
			const document = await super.getById(id, { name: 1, type: 1 }, ['type'])
			if (!document) {
				throw new HttpError(404, `User with id:${id} not found`)
			}
			return document
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, `Failed to get user with id:${id}`, err)
		}
	}
	async findOne(filters) {
		try {
			const document = await super.findOne(filters, {}, ['type'])
			if (!document) {
				throw new HttpError(404, 'User not found')
			}
			return document
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get user by filters')
		}
	}
}

export default new UsersDBService(User)
