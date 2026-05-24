import { Types } from 'mongoose'
import Product from './Product.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { HttpError } from '../../../../errors/HttpError.mjs'
import { productPopulateFields, productBaseFieldsConfigurations } from './constants.mjs'
import formatReqPriceRange from '../../../../utils/formatters/products/formatReqPriceRange.mjs'
import formatProductForResponse from '../../../../utils/formatters/products/formatProductForResponse.mjs'
import { appConstants } from '../../../../constants/app.mjs'
import { errorCodes } from '../../../../constants/errorCodes.mjs'
import detectLang from '../../../../utils/locale/detectLang.mjs'
import buildProductSuggestionsPipeline from '../../agregations/productSuggestions/buildProductSuggestionsPipeline.mjs'

class ProductsDBService extends MongooseCRUDManager {
	async getList(reqQuery, language, currency, rate) {
		try {
			const req = { ...reqQuery }
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

	async getSuggestions(reqQuery, lang) {
		try {
			const { title, limit } = reqQuery
			const sliceLimit = Number(limit) || appConstants.defaultSuggestionsLimit
			const titleLang = title ? detectLang(title) : lang

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

	async getAdminById(id) {
		try {
			const document = await super.getById(id, {}, productPopulateFields)

			return {
				...document,
				variants: (document?.variants || []).map((variant) => ({
					...variant,
					price: Number.parseFloat(variant?.price?.toString?.() ?? variant?.price),
					oldPrice:
						variant?.oldPrice == null
							? null
							: Number.parseFloat(variant?.oldPrice?.toString?.() ?? variant?.oldPrice),
				})),
			}
		} catch (err) {
			if (err instanceof HttpError) throw err
			throw new HttpError(500, `Failed to load product id:${id}`, {
				code: errorCodes.DATABASE_ERROR,
				cause: err,
			})
		}
	}

	async createProduct(data) {
		try {
			const product = new Product(data)
			await product.save()

			return product.toObject()
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err && (err.code === 11000 || err.code === 11001 || err.name === 'ValidationError')) throw err
			throw new HttpError(500, 'Failed to create product', {
				code: errorCodes.DATABASE_ERROR,
				cause: err,
			})
		}
	}

	async updateProduct(id, data) {
		try {
			const product = await Product.findById(id)

			if (!product) {
				throw new HttpError(404, `Product with id:${id} not found`, {
					code: errorCodes.NOT_FOUND,
					expose: true,
				})
			}

			product.set(data)
			await product.save()

			return product.toObject()
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (
				err &&
				(err.code === 11000 ||
					err.code === 11001 ||
					err.name === 'ValidationError' ||
					err.name === 'CastError')
			) {
				throw err
			}
			throw new HttpError(500, 'Failed to update product', {
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
						minPrice: {
							$toDouble: {
								$multiply: ['$minPrice', rate],
							},
						},
						maxPrice: {
							$toDouble: {
								$multiply: ['$maxPrice', rate],
							},
						},
					},
				},
			])

			if (!result) {
				console.error('Price range not available')
				return []
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
