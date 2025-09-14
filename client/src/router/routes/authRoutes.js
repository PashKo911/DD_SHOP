export default [
	{
		path: 'auth',
		redirect: { name: 'signin' },
		meta: {
			useInMenu: false,
			requiredAuth: false,
		},

		children: [
			{
				path: 'signin',
				name: 'signin',
				component: () => import('@/pages/signin/SigninPage.vue'),
				meta: {
					useInMenu: false,
					requiredAuth: false,
				},
			},
			{
				path: 'signup',
				name: 'signup',
				component: () => import('@/pages/signup/SignupPage.vue'),
				meta: {
					useInMenu: false,
					requiredAuth: false,
				},
			},
		],
	},
]
