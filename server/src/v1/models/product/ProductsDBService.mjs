import Product from './Product.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'
import { getRate } from '../../../../services/ratesCache.mjs'

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

			const res = await this.findManyWithSearchOptions(reqQuery, ProductsDBService.fieldsConfigurations, {
				title: 1,
				price: 1,
				count: 1,
				paths: 1,
				gender: 1,
			})

			return res
		} catch (error) {
			console.error(error)
			return []
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
