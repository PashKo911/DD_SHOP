const apiEndpoints = {
	products: {
		getProducts: '/products',
		getSuggestions: '/products/suggestions',
		getOptions: '/products/options',
		getStyles: '/products/styles',
	},
	auth: {
		signin: '/auth/signin',
		signup: '/auth/signup',
		profileByToken: '/auth/profile',
	},
	users: {
		getUsersWithAttempts: '/users/users-with-attempts',
		deleteUser: (id) => `/users/${id}`,
	},
}

export default apiEndpoints
