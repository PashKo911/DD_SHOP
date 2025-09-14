import Size from './Size.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import { errorCodes } from '../../../../config/errorCodes.mjs'

class SizeStyleDBService extends MongooseCRUDManager {
	async getList() {
		try {
			const res = super.getList()
			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get sizes', { cause: err, code: errorCodes.DATABASE_ERROR })
		}
	}
}

export default new SizeStyleDBService(Size)
