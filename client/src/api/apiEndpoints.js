const apiEndpoints = {
	products: {
		getOptions: '/products/options',
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
