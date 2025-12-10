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
		updateProductQuantity: '/cart/update',
		deleteProduct: '/cart/delete',
	},
	users: {
		getUsersWithAttempts: '/users/users-with-attempts',
		fetchUsers: '/users',
		updateUserType: (id) => `/users/${id}`,
		deleteUser: (id) => `/users/${id}`,
	},
	reviews: {
		getRandomReviews: '/reviews',
	},
	types: {
		getTypes: '/types',
	},
}

export default apiEndpoints
