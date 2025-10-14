const shopCategories = Object.freeze(['women', 'men'])
const defaultCategory = shopCategories[0]
const defaultSort = Object.freeze({
	value: 'maxRating:desc',
	label: 'pages.shop.sortSelect.ratingDesc',
	slug: 'naipopuliarnishi',
})
const storageKeys = Object.freeze({
	locale: 'locale',
	cart: 'cart',
	token: 'token',
})

const shopConstants = Object.freeze({
	shopCategories,
	defaultCategory,
	defaultSort,
	storageKeys,
	suggestionCountLimit: 5,
	productRowsCount: 3,
})

export default shopConstants
