import routeNames from '../routeNames'
import { getRouteLocale } from '../../utils/locale/getRouteLocale'

export default [
	{
		path: 'auth',
		name: routeNames.AUTH,
		redirect: (to) => ({
			name: routeNames.SIGNIN,
			params: { locale: getRouteLocale(to) },
		}),
		meta: {
			useInMenu: false,
			requiredAuth: false,
			guestOnly: true,
		},

		children: [
			{
				path: 'signin',
				name: routeNames.SIGNIN,
				component: () => import('@/pages/signin/SigninPage.vue'),
				meta: {
					useInMenu: false,
					guestOnly: true,
				},
			},
			{
				path: 'signup',
				name: routeNames.SIGNUP,
				component: () => import('@/pages/signup/SignupPage.vue'),
				meta: {
					useInMenu: false,
					guestOnly: true,
				},
			},
		],
	},
]
