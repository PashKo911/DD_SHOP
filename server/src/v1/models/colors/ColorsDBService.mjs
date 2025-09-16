import Color from './Color.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import { errorCodes } from '../../../../constants/errorCodes.mjs'

class ColorsDBService extends MongooseCRUDManager {
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
			throw new HttpError(500, 'Failed to get available colors', {
				code: errorCodes.DATABASE_ERROR,
				cause: err,
			})
		}
	}
}

export default new ColorsDBService(Color)
