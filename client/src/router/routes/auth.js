import routeNames from '../routeNames'
import SigninPage from '@/pages/signin/SigninPage.vue'
import SignupPage from '@/pages/signup/SignupPage.vue'

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
				meta: {
					useInMenu: false,
					requiredAuth: false,
				},
			},
			{
				path: 'signup',
				name: routeNames.SIGNUP,
				component: SignupPage,
				meta: {
					useInMenu: false,
					requiredAuth: false,
				},
			},
		],
	},
]
