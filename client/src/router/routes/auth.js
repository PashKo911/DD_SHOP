import routeNames from '../routeNames'

export default [
	{
		path: 'auth',
		redirect: { name: routeNames.SIGNIN },
		meta: {
			useInMenu: false,
			requiredAuth: false,
		},

		// children: [
		// 	{
		// 		path: 'signin',
		// 		name: routeNames.SIGNIN,
		// 		component: SigninPage,
		// 		meta: {
		// 			useInMenu: false,
		// 			requiredAuth: false,
		// 		},
		// 	},
		// 	{
		// 		path: 'signup',
		// 		name: routeNames.SIGNUP,
		// 		component: SignupPage,
		// 		meta: {
		// 			useInMenu: false,
		// 			requiredAuth: false,
		// 		},
		// 	},
		// ],
	},
]
