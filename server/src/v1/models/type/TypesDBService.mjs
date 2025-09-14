import Type from './Type.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'

class TypesDBService extends MongooseCRUDManager {
	async getList({ filters }) {
		try {
			const res = await super.findOne(filters, { title: 1 })
			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get types', { cause: err, code: errorCodes.DATABASE_ERROR })
		}
	}
}

export default new TypesDBService(Type)
