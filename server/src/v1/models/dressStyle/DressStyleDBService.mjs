import DressStyle from './DressStyle.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import { errorCodes } from '../../../../config/errorCodes.mjs'

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
			throw new HttpError(500, 'Failed to get dress styles', { code: errorCodes.DATABASE_ERROR, cause: err })
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
			throw new HttpError(500, 'Failed to get dress styles with img', {
				code: errorCodes.DATABASE_ERROR,
				cause: err,
			})
		}
	}
}

export default new DressStyleDBService(DressStyle)
