import Color from './Color.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import config from '../../../../config/default.mjs'

class ColorsDBService extends MongooseCRUDManager {
	async getList(language) {
		try {
			const currentLanguage = language || config.defaultLanguage

			const projection = {
				[`label.${currentLanguage}`]: 1,
				value: 1,
				slug: 1,
			}

			const docs = await super.getList({}, projection)
			return docs.map((d) => ({ ...d, label: d.label[currentLanguage] }))
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get available colors', err)
		}
	}
}

export default new ColorsDBService(Color)
