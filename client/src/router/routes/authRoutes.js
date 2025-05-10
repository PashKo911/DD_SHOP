export default [
	{
		path: '/auth',
		redirect: { name: 'signIn' },
		meta: {
			useInMenu: false,
			requiredAuth: false,
		},

		children: [
			{
				path: 'sign-in',
				name: 'signIn',
				component: () => import('@/pages/signIn/SignInPage.vue'),
				meta: {
					useInMenu: false,
					requiredAuth: false,
				},
			},
			{
				path: 'sign-up',
				name: 'signUp',
				component: () => import('@/pages/signUp/SignUpPage.vue'),
				meta: {
					useInMenu: false,
					requiredAuth: false,
				},
			},
		],
	},
]
