const apiEndpoints = {
	products: {
		getProducts: '/products',
		getSuggestions: '/products/suggestions',
		getOptions: '/products/options',
		getStyles: '/products/styles',
		getProductDetails: (id) => `/products/detail/${id}`,
	},
	auth: {
		signin: '/auth/signin',
		signup: '/auth/signup',
		authWithGoogle: '/auth/google',
		profileByToken: '/auth/profile',
	},
	subscriber: {
		subscribe: '/subscriber',
	},
	cart: {
		init: '/cart/init',
		populateCart: '/cart/populate',
		addProduct: '/cart/add',
		updateProductAmount: '/cart/amount',
		deleteProduct: '/cart/delete',
	},
	users: {
		getUsersWithAttempts: '/users/users-with-attempts',
		deleteUser: (id) => `/users/${id}`,
	},
	reviews: {
		getRandomReviews: '/reviews',
	},
}

export default apiEndpoints
