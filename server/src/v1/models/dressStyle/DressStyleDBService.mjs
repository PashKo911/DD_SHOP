import DressStyle from './DressStyle.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import { errorCodes } from '../../../../constants/errorCodes.mjs'

class DressStyleDBService extends MongooseCRUDManager {
	async getList(language) {
		try {
			const docs = await DressStyle.aggregate([
				{
					$project: {
						_id: 1,
						value: 1,
						slug: 1,
						label: `$label.${language}`,
						imgSrc: 1,
					},
				},
				{
					$sort: {
						order: -1,
					},
				},
			])
			return docs
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get dress styles', { code: errorCodes.DATABASE_ERROR, cause: err })
		}
	}
}

export default new DressStyleDBService(DressStyle)
