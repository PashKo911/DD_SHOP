import Product from './Product.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

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

	async getList(reqQuery) {
		try {
			// const res = await super.getList(filters, { title: 1, price: 1, count: 1, paths: 1 })

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
	async getPriceRange() {
		try {
			const result = await this.model.aggregate([
				{
					$group: {
						_id: null,
						minPrice: { $min: '$price' },
						maxPrice: { $max: '$price' },
					},
				},
			])

			if (result.length === 0) {
				return { minPrice: 0, maxPrice: 0 }
			}

			return {
				minPrice: result[0].minPrice,
				maxPrice: result[0].maxPrice,
			}
		} catch (error) {
			throw new Error('Error retrieving price range: ' + error.message)
		}
	}
}

export default new ProductsDBService(Product)
