import routeNames from '../routeNames'

export default [
	{
		path: 'auth',
		redirect: { name: routeNames.SIGNIN },
		meta: {
			useInMenu: false,
			requiredAuth: false,
		},

		children: [
			{
				path: 'signin',
				name: routeNames.SIGNIN,
				// component: () => import('@/pages/signin/SigninPage.vue'),
				meta: {
					useInMenu: false,
					requiredAuth: false,
				},
			},
			{
				path: 'signup',
				name: routeNames.SIGNUP,
				component: () => import('@/pages/signup/SignupPage.vue'),
				meta: {
					useInMenu: false,
					requiredAuth: false,
				},
			},
		],
	},
]
