import Color from './Color.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class ColorsDBService extends MongooseCRUDManager {
	async getList(language) {
		try {
			const projection = language === 'en' ? { labelUk: 0 } : {}
			const res = await super.getList({}, projection)
			return res
		} catch (error) {
			console.error(error)
			return []
		}
	}
}

export default new ColorsDBService(Color)
