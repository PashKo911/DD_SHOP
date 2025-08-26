import DressStyle from './DressStyle.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import { locales } from '../../../../config/locales.mjs'
import { resolveLocale } from '../../../../utils/resolveLocale.mjs'

class DressStyleDBService extends MongooseCRUDManager {
	async getList(language) {
		try {
			const projection = {
				[`label.${language}`]: 1,
				value: 1,
				slug: 1,
			}

			const docs = await super.getList({}, projection)
			return docs.map((d) => ({ ...d, label: d.label[language] }))
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get dress styles', err)
		}
	}
	async getListWithImg(language) {
		try {
			const projection = {
				[`label.${language}`]: 1,
				value: 1,
				imgSrc: 1,
			}

			const docs = await super.getList({}, projection)
			return docs.map((d) => ({ ...d, label: d.label[language] }))
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get dress styles with img', err)
		}
	}
}

export default new DressStyleDBService(DressStyle)
