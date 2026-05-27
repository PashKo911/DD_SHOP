import routeNames from '../routeNames'
import { getRouteLocale } from '../../utils/locale/getRouteLocale'

export default {
	path: 'shop/:category?',
	name: routeNames.SHOP,
	component: () => import('@/components/layouts/BreadcrumbLayout.vue'),
	redirect: (to) => ({
		name: routeNames.SHOP_CATEGORY,
		params: {
			locale: getRouteLocale(to),
			category: to.params.category,
		},
	}),
	meta: {
		useInMenu: true,
		requiredAuth: false,
		localeName: (category) => `pages.${category}.title.menu`,
	},
	children: [
		{
			path: '',
			name: routeNames.SHOP_CATEGORY,
			props: true,
			component: () => import('@/pages/shop/ShopPage.vue'),
		},
		{
			path: ':slug/:id/:variant/:size?',
			name: routeNames.PRODUCT_DETAIL,
			component: () => import('@/pages/productDetail/ProductDetailPage.vue'),
			props: true,
			meta: {
				useInMenu: false,
				localeName: 'pages.productDetail.title.menu',
			},
		},
	],
}
