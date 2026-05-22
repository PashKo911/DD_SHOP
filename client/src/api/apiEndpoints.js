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
		profile: '/auth/profile',
		refresh: '/auth/refresh',
		logout: '/auth/logout',
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
	admin: {
		fetchUsers: '/admin/users',
		updateUserType: (id) => `admin/users/${id}`,
		deleteUser: (id) => `admin/users/${id}`,
		fetchProducts: '/admin/products',
		createProduct: '/admin/products',
		updateProduct: (id) => `/admin/products/${id}`,
		deleteProduct: (id) => `/admin/products/${id}`,
		getAdminProduct: (id) => `/admin/products/${id}`,
	},
	reviews: {
		getRandomReviews: '/reviews',
	},
	types: {
		getTypes: '/types',
	},
}

export default apiEndpoints
