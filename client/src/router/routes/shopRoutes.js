import BreadcrumbLayout from '@/components/layouts/BreadcrumbLayout.vue'
import ShopPage from '@/pages/shop/ShopPage.vue'

export default {
	path: '/shop/:category',
	name: 'shop',
	component: BreadcrumbLayout,
	redirect: { name: 'shopCategory' },
	meta: {
		useInMenu: true,
		requiredAuth: false,
		localeName: (route) => `pages.${route.params.category}.title.menu`,
	},
	children: [
		{
			path: '',
			name: 'shopCategory',
			props: true,
			component: ShopPage,
		},
		{
			path: ':slug/:id/:variant',
			name: 'productDetail',
			component: () => import('@/pages/productDetail/ProductDetailPage.vue'),
			props: true,
			meta: {
				useInMenu: false,
				localeName: 'pages.productDetail.title.menu',
			},
		},
	],
}
