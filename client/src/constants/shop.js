const shopCategories = Object.freeze(['women', 'men'])
const defaultCategory = shopCategories[0]
const defaultSort = Object.freeze({
	value: 'maxRating:desc',
	label: 'pages.shop.sortSelect.ratingDesc',
	slug: 'naipopuliarnishi',
})

const shopConstants = Object.freeze({
	shopCategories,
	defaultCategory,
	defaultSort,
})

export default shopConstants
