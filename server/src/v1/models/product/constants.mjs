export const PRODUCT_POPULATE_FIELDS = ['variants.color', 'variants.sizes', 'style', 'gender']

export const PRODUCT_BASE_FIELDS_CONFIGURATIONS = [
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
