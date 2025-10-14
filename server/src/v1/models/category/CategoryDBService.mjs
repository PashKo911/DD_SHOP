import Category from './Category.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class CategoryDBService extends MongooseCRUDManager {
	async getList() {
		try {
			const res = super.getList()
			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get categories', { cause: err, code: errorCodes.DATABASE_ERROR })
		}
	}
}

export default new CategoryDBService(Category)
