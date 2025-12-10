import routeNames from '../routeNames'

export default [
	{
		path: 'dashboard',
		name: routeNames.dashboard,
		redirect: { name: routeNames.dashboardProducts },
		component: () => import('@/pages/dashboard/DashboardPage.vue'),
		meta: {
			useInMenu: false,
			requiredAuth: true,
		},
		children: [
			{
				path: 'users',
				name: routeNames.dashboardUsers,
				component: () => import('@/pages/dashboard/users/DashboardUsers.vue'),
			},
			{
				path: 'products',
				name: routeNames.dashboardProducts,
				component: () =>
					import('@/pages/dashboard/products/DashboardProducts.vue'),
			},
		],
	},
]
