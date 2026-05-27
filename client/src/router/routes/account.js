import routeNames from '../routeNames'

export default [
	{
		path: 'account',
		name: routeNames.account,
		component: () => import('@/pages/account/AccountPage.vue'),
		meta: {
			useInMenu: false,
			requiredAuth: true,
			guestOnly: false,
			localeName: 'pages.account.title',
		},
	},
]
