import Product from './Product.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { getRate } from '../../../../services/ratesCache.mjs'
import getDiscount from '../../../../utils/getDiscount.mjs'

class ProductsDBService extends MongooseCRUDManager {
	static fieldsConfigurations = [
		{
			fieldName: 'title',
			filterCategory: 'search',
		},
		{
			fieldName: 'gender',
			filterCategory: 'list',
		},
		{
			fieldName: 'price',
			filterCategory: 'range',
		},
		{
			fieldName: 'colors',
			filterCategory: 'list',
		},
		{
			fieldName: 'sizes',
			filterCategory: 'list',
		},
		{
			fieldName: 'styles',
			filterCategory: 'list',
		},
	]

	async getList(reqQuery, language, currency) {
		try {
			const rate = await getRate(currency)

			if (reqQuery.price) {
				reqQuery.price = [Math.floor(reqQuery.price[0] / rate), Math.ceil(reqQuery.price[1] / rate)]
			}

			const { documents, count } = await this.findManyWithSearchOptions(
				reqQuery,
				ProductsDBService.fieldsConfigurations,
				{
					title: 1,
					price: 1,
					oldPrice: 1,
					count: 1,
					paths: 1,
					description: 1,
					gender: 1,
				}
			)

			const localized = documents.map((doc) => {
				const obj = doc.toObject()
				return this.formatDocumentData(obj, language, currency, rate)
			})

			return { documents: localized, count }
		} catch (error) {
			console.error(error)
			return { documents: [], count: 0 }
		}
	}

	formatDocumentData(product, language, currency, rate) {
		const formatter = new Intl.NumberFormat(language === 'uk' ? 'uk-UA' : 'en-US', {
			style: 'currency',
			currency,
			maximumFractionDigits: 0,
		})

		const exchangedPrice = Math.round(product.price * rate)

		return {
			...product,
			title: product.title[language],
			description: product.description[language],
			price: formatter.format(exchangedPrice),
			discount: getDiscount(product.oldPrice, product.price),
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
				{
					$group: {
						_id: null,
						minPrice: { $min: '$price' },
						maxPrice: { $max: '$price' },
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

			if (result.length === 0) {
				throw new Error('Price range array is empty ' + error.message)
			}
			return [result.minPrice, result.maxPrice]
		} catch (error) {
			throw new Error('Error retrieving price range: ' + error.message)
		}
	}
}

export default new ProductsDBService(Product)
