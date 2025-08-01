import DressStyle from './DressStyle.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'

class DressStyleDBService extends MongooseCRUDManager {
	async getList(language) {
		try {
			const projection = language === 'en' ? { labelUk: 0, imgSrc: 0 } : { imgSrc: 0 }
			const res = await super.getList({}, projection)
			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get dress styles', err)
		}
	}
	async getListWithImg(language) {
		try {
			const projection = language === 'en' ? { labelUk: 0 } : {}
			const res = await super.getList({}, projection)
			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get dress styles with img', err)
		}
	}
}

export default new DressStyleDBService(DressStyle)
