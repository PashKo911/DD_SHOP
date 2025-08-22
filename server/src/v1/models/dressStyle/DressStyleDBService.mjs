import DressStyle from './DressStyle.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import config from '../../../../config/default.mjs'

class DressStyleDBService extends MongooseCRUDManager {
	async getList(language) {
		try {
			const currentLanguage = language || config.defaultLanguage

			const projection = {
				[`label.${currentLanguage}`]: 1,
				value: 1,
			}

			const docs = await super.getList({}, projection)
			return docs.map((d) => ({ ...d, label: d.label[currentLanguage] }))
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get dress styles', err)
		}
	}
	async getListWithImg(language) {
		try {
			const currentLanguage = language || config.defaultLanguage
			const projection = {
				[`label.${currentLanguage}`]: 1,
				value: 1,
				imgSrc: 1,
			}

			const docs = await super.getList({}, projection)
			return docs.map((d) => ({ ...d, label: d.label[currentLanguage] }))
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get dress styles with img', err)
		}
	}
}

export default new DressStyleDBService(DressStyle)
