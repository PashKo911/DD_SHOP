import routeNames from '@/router/routeNames'
import shopConstants from './shop'

export const queryPresets = {
	topSales: {
		name: 'topSalesProducts',
		queryParams: { sort: 'maxRating:desc,', page: 0, perPage: 15 },
	},
	newest: {
		name: 'newestProducts',
		queryParams: { sort: 'createdAt:desc', page: 0, perPage: 15 },
	},
	same: {
		name: 'sameProducts',
		queryParams: { sort: 'maxRating:desc,', page: 0, perPage: 15 },
	},
	suggestions: {
		name: 'suggestions',
		queryParams: {
			limit: shopConstants.suggestionCountLimit,
		},
	},
	productDetail: {
		name: routeNames.PRODUCT_DETAIL,
	},
	productOptions: {
		name: 'dashboardProductOptions',
	},
	adminProduct: {
		name: 'dashboardAdminProduct',
	},
	createProduct: {
		name: 'dashboardCreateProduct',
	},
	updateProduct: {
		name: 'dashboardUpdateProduct',
	},
	deleteProduct: {
		name: 'deleteProduct',
	},
}
