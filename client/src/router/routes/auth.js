import routeNames from '../routeNames'
import SigninPage from '@/pages/signin/SigninPage.vue'

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
				component: SigninPage,
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
