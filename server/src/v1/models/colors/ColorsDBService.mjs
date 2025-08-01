import Color from './Color.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'

class ColorsDBService extends MongooseCRUDManager {
	async getList(language) {
		try {
			const projection = language === 'en' ? { labelUk: 0 } : {}
			const res = await super.getList({}, projection)
			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get available colors', err)
		}
	}
}

export default new ColorsDBService(Color)
