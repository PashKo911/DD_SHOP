export const productPopulateFields = ['variants.color', 'variants.sizes', 'style', 'gender']

export const productBaseFieldsConfigurations = [
	{
		fieldName: 'gender',
		subField: null,
		queryParam: 'gender',
		filterCategory: 'list',
	},
	{
		fieldName: 'title',
		subField: 'label',
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
