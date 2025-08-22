export default {
	path: 'shop/:category?',
	name: 'shop',
	component: () => import('@/components/layouts/BreadcrumbLayout.vue'),
	redirect: { name: 'shopCategory' },
	meta: {
		useInMenu: true,
		requiredAuth: false,
		localeName: (category) => `pages.${category}.title.menu`,
	},
	children: [
		{
			path: '',
			name: 'shopCategory',
			props: true,
			component: () => import('@/pages/shop/ShopPage.vue'),
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
