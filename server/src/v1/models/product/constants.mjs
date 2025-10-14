export const productPopulateFields = ['variants.color', 'variants.sizes', 'style', 'category']

export const productBaseFieldsConfigurations = [
	{
		fieldName: 'category',
		subField: null,
		queryParam: 'category',
		filterCategory: 'list',
	},
	{
		fieldName: 'title',
		subField: null,
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
