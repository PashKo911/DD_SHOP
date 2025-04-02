import User from './User.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class UsersDBService extends MongooseCRUDManager {
	async getList(filters) {
		try {
			const res = await super.getList(filters, { password: 0 }, ['type'])
			return res
		} catch (error) {
			console.error(error)
			return []
		}
	}
	async getById(id) {
		try {
			const res = await super.getById(id, { name: 1, type: 1 }, ['type'])
			return res
		} catch (error) {
			throw new Error('Error finding data by id: ' + error.message)
		}
	}
	async findOne(filters) {
		try {
			const res = await super.findOne(filters, {}, ['type'])
			return res
		} catch (error) {
			throw new Error('Error finding data by id: ' + error.message)
		}
	}
}

export default new UsersDBService(User)
