import routeNames from '../routeNames'
import { userRoles } from '@/constants/roles'
import { getRouteLocale } from '../../utils/locale/getRouteLocale'

export default [
	{
		path: 'dashboard',
		name: routeNames.dashboard,
		redirect: (to) => ({
			name: routeNames.dashboardProducts,
			params: { locale: getRouteLocale(to) },
		}),
		component: () => import('@/pages/dashboard/DashboardPage.vue'),
		meta: {
			useInMenu: false,
			requiredAuth: true,
			roles: [userRoles.manager, userRoles.admin],
		},
		children: [
			{
				path: 'users',
				name: routeNames.dashboardUsers,
				component: () => import('@/pages/dashboard/users/DashboardUsers.vue'),
				meta: {
					roles: [userRoles.manager, userRoles.admin],
				},
			},
			{
				path: 'products',
				name: routeNames.dashboardProducts,
				component: () =>
					import('@/pages/dashboard/products/DashboardProducts.vue'),
				meta: {
					roles: [userRoles.manager, userRoles.admin],
				},
			},
			{
				path: 'products/create',
				name: routeNames.dashboardProductCreate,
				component: () =>
					import('@/pages/dashboard/products/ProductFormPage.vue'),
				meta: {
					roles: [userRoles.manager, userRoles.admin],
				},
			},
			{
				path: 'products/:id/edit',
				name: routeNames.dashboardProductEdit,
				component: () =>
					import('@/pages/dashboard/products/ProductFormPage.vue'),
				meta: {
					roles: [userRoles.manager, userRoles.admin],
				},
			},
		],
	},
]
