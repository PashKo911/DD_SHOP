import { Types } from 'mongoose'
import Product from './Product.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { createFieldsConfigurations } from '../../../../utils/createFieldsConfigurations.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import { productPopulateFields, productBaseFieldsConfigurations } from './constants.mjs'
import { formatProductForResponse, formatReqPriceRange } from '../../../../utils/formatters/formatters.mjs'
import { appConstants } from '../../../../constants/app.mjs'
import { errorCodes } from '../../../../constants/errorCodes.mjs'
import detectLang from '../../../../utils/detectLang.mjs'
import buildProductSuggestionsPipeline from '../../agregations/productSuggestions/buildProductSuggestionsPipeline.mjs'

class ProductsDBService extends MongooseCRUDManager {
	async getList(reqQuery, language, currency, rate) {
		try {
			const req = { ...reqQuery }
			console.log('req.title ++++++++++++++++')
			console.log(req.title)
			if (currency !== appConstants.defaultCurrency) {
				formatReqPriceRange(req, rate)
			}

			const { documents, count } = await this.findManyWithSearchOptions(
				req,
				productBaseFieldsConfigurations,
				{},
				productPopulateFields
			)

			const localized = documents.map((doc) => {
				const res = formatProductForResponse(doc, language, rate)
				return res
			})

			return { documents: localized, count }
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get product list', { code: errorCodes.DATABASE_ERROR, cause: err })
		}
	}

	async getSuggestions(reqQuery) {
		try {
			const { title, limit } = reqQuery
			const sliceLimit = Number(limit) || appConstants.defaultSuggestionsLimit
			const titleLang = detectLang(title)

			const pipeline = buildProductSuggestionsPipeline(title, titleLang, sliceLimit, appConstants.searchDepth)

			const suggestions = await Product.aggregate(pipeline)

			return suggestions
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get suggestions', { code: errorCodes.DATABASE_ERROR, cause: err })
		}
	}

	async getById(id, language, rate) {
		try {
			const document = await super.getById(id, {}, productPopulateFields)
			const res = formatProductForResponse(document, language, rate)

			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, `Failed to load product id:${id}`, {
				code: errorCodes.DATABASE_ERROR,
				cause: err,
			})
		}
	}
	async getPriceRange(rate) {
		try {
			const [result] = await this.model.aggregate([
				{ $unwind: '$variants' },
				{
					$group: {
						_id: null,
						minPrice: { $min: '$variants.price' },
						maxPrice: { $max: '$variants.price' },
					},
				},
				{
					$project: {
						_id: 0,
						minPrice: { $multiply: ['$minPrice', rate] },
						maxPrice: { $multiply: ['$maxPrice', rate] },
					},
				},
			])

			if (!result) {
				throw new HttpError(404, 'Price range not available', { code: errorCodes.NOT_FOUND })
			}
			return [result.minPrice, result.maxPrice]
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to retrieve price range', {
				code: errorCodes.DATABASE_ERROR,
				cause: err,
			})
		}
	}
}

export default new ProductsDBService(Product)

//========================================================================================================================================================
