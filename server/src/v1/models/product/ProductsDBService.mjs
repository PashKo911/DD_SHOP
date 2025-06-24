import Product from './Product.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { getRate } from '../../../../services/ratesCache.mjs'
import getDiscount from '../../../../utils/getDiscount.mjs'

class ProductsDBService extends MongooseCRUDManager {
	static fieldsConfigurations = [
		{
			fieldName: 'gender',
			subField: null,
			queryParam: 'gender',
			filterCategory: 'list',
		},
		{
			fieldName: 'title',
			subField: '{lang}',
			queryParam: 'title',
			filterCategory: 'search',
		},
		{
			fieldName: 'variants',
			subField: 'price',
			queryParam: 'price',
			filterCategory: 'range',
		},
		{
			fieldName: 'variants',
			subField: 'color',
			queryParam: 'colors',
			filterCategory: 'list',
		},
		{
			fieldName: 'variants',
			subField: 'sizes',
			queryParam: 'sizes',
			filterCategory: 'list',
		},
		{
			fieldName: 'style',
			subField: null,
			queryParam: 'styles',
			filterCategory: 'list',
		},
	]

	static getFieldsConfigurations(language) {
		return this.fieldsConfigurations.map((cfg) => {
			const subField = cfg.subField ? cfg.subField.replace('{lang}', language) : null
			return {
				...cfg,
				subField,
			}
		})
	}

	async getList(reqQuery, language, currency) {
		try {
			const rate = await getRate(currency)
			const fieldsConfigurations = ProductsDBService.getFieldsConfigurations(language)

			const formatter = new Intl.NumberFormat(language === 'uk' ? 'uk-UA' : 'en-US', {
				style: 'currency',
				currency,
				maximumFractionDigits: 0,
			})

			if (reqQuery.price) {
				reqQuery.price = [Math.floor(reqQuery.price[0] / rate), Math.ceil(reqQuery.price[1] / rate)]
			}

			const { documents, count } = await this.findManyWithSearchOptions(reqQuery, fieldsConfigurations, {}, [
				'variants.color',
				'variants.sizes',
			])

			const localized = documents.map((doc) => {
				const obj = doc.toObject()
				return this.formatDocumentData(obj, language, rate, formatter)
			})

			return { documents: localized, count }
		} catch (error) {
			console.error(error)
			return { documents: [], count: 0 }
		}
	}

	async getSuggestions(reqQuery, language, currency) {
		try {
			const fieldsConfigurations = ProductsDBService.getFieldsConfigurations(language)

			const { documents } = await this.findManyWithSearchOptions(
				reqQuery,
				fieldsConfigurations,
				{
					title: 1,
					gender: 1,
					_id: 0,
				},
				['gender']
			)
			const res = documents.map((d) => ({ title: d.title[language], gender: d.gender }))
			return res
		} catch (error) {
			console.error(error)
			return { documents: [], count: 0 }
		}
	}

	formatDocumentData(product, language, rate, formatter) {
		const formattedVariants = product.variants.map((v) => {
			const exchangedPrice = Math.round(v.price * rate)
			const exchangedOldPrice = v.oldPrice ? Math.round(v.oldPrice * rate) : null
			const oldPrice = exchangedOldPrice ? formatter.format(exchangedOldPrice) : null

			return {
				...v,
				oldPrice,
				price: formatter.format(exchangedPrice),
				discount: getDiscount(v.oldPrice, v.price),
			}
		})

		return {
			...product,
			variants: formattedVariants,
			title: product.title[language],
			description: product.description[language],
		}
	}

	async getById(id) {
		try {
			const res = await super.getById(id, {}, ['colors', 'styles', 'gender', 'sizes'])
			return res
		} catch (error) {
			throw new Error('Error finding data by id: ' + error.message)
		}
	}
	async getPriceRange(currency) {
		const rate = await getRate(currency)

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
				throw new Error('No price data found')
			}

			return [result.minPrice, result.maxPrice]
		} catch (error) {
			throw new Error('Error retrieving price range: ' + error.message)
		}
	}
}

export default new ProductsDBService(Product)
