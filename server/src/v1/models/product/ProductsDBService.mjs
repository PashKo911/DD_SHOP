import Product from './Product.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { createCurrencyFormatter } from '../../../../utils/currencyFormatter.mjs'
import { createFieldsConfigurations } from './fieldsConfig.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import { PRODUCT_POPULATE_FIELDS, PRODUCT_BASE_FIELDS_CONFIGURATIONS } from './constants.mjs'
import { formatProductForResponse, formatReqPriceRange } from './formatters.mjs'
import { config } from '../../../../config/default.mjs'
import { errorCodes } from '../../../../config/errorCodes.mjs'

class ProductsDBService extends MongooseCRUDManager {
	static fieldsConfigurations = PRODUCT_BASE_FIELDS_CONFIGURATIONS

	async getList(reqQuery, language, currency, rate) {
		try {
			const configurations = createFieldsConfigurations(ProductsDBService.fieldsConfigurations, language)
			const formatter = createCurrencyFormatter(language, currency)
			const req = { ...reqQuery }

			if (currency !== config.defaultCurrency) {
				formatReqPriceRange(req, rate)
			}

			const { documents, count } = await this.findManyWithSearchOptions(
				req,
				configurations,
				{},
				PRODUCT_POPULATE_FIELDS
			)

			const localized = documents.map((doc) => {
				return formatProductForResponse(doc, language, rate, formatter)
			})

			return { documents: localized, count }
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get product list', { code: errorCodes.DATABASE_ERROR, cause: err })
		}
	}

	async getSuggestions(reqQuery, language) {
		try {
			const configurations = createFieldsConfigurations(ProductsDBService.fieldsConfigurations, language)

			const { documents } = await this.findManyWithSearchOptions(
				reqQuery,
				configurations,
				{
					title: 1,
					gender: 1,
					_id: 0,
				},
				['gender']
			)
			const res = documents.map((d) => ({ title: d.title[language], gender: d.gender }))
			return res
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, 'Failed to get suggestions', { code: errorCodes.DATABASE_ERROR, cause: err })
		}
	}

	async getById(id, language, currency, rate) {
		try {
			const formatter = createCurrencyFormatter(language, currency)

			const document = await super.getById(id, {}, PRODUCT_POPULATE_FIELDS)
			const res = formatProductForResponse(document, language, rate, formatter)

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
