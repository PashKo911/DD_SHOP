import Type from './Type.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class TypesDBService extends MongooseCRUDManager {
	static async getList({ filters }) {
		try {
			const res = await Type.find(filters, { title: 1 })
			return res
		} catch (error) {
			return []
		}
	}
}

export default new TypesDBService(Type)
