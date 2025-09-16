import shopConstants from '@/constants/shop'

const sortOptionsData = [
	{
		value: 'minPrice:asc',
		label: 'pages.shop.sortSelect.priceAsc',
		slug: 'spochatku-deshevi',
	},
	{
		value: 'maxPrice:desc',
		label: 'pages.shop.sortSelect.priceDesc',
		slug: 'spochatku-dorogi',
	},
	{
		value: 'createdAt:desc',
		label: 'pages.shop.sortSelect.newest',
		slug: 'spochatku-novi',
	},
	shopConstants.defaultSort,
]

export default sortOptionsData
