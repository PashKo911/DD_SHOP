import Gender from './Gender.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class GenderDBService extends MongooseCRUDManager {
	async getList() {
		try {
			const res = super.getList()
			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get genders', { cause: err, code: errorCodes.DATABASE_ERROR })
		}
	}
}

export default new GenderDBService(Gender)
