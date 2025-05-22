import DressStyle from './DressStyle.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class DressStyleDBService extends MongooseCRUDManager {
	async getList(language) {
		try {
			const projection = language === 'en' ? { labelUk: 0, imgSrc: 0 } : { imgSrc: 0 }
			const res = await super.getList({}, projection)
			return res
		} catch (error) {
			console.error(error)
			return []
		}
	}
	async getListWithImg(language) {
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

export default new DressStyleDBService(DressStyle)
