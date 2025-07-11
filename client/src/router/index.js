import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './routes/authRoutes'
import shopRoutes from './routes/shopRoutes'
import { useCommonStore } from '@/stores/commonStore'
import { storeToRefs } from 'pinia'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	scrollBehavior(to, from) {
		const pathFrom = from.path
		const pathTo = to.path

		if (pathFrom === pathTo) {
			return { left: 0, top: 0, behavior: 'smooth' }
		}
		return { top: 0, left: 0 }
	},
	routes: [
		{
			path: '/',
			redirect: { name: 'home' },
			meta: {
				useInMenu: false,
				requiredAuth: false,
			},
		},
		{
			path: '/home',
			name: 'home',
			component: () => import('@/pages/home/HomePage.vue'),
			meta: {
				useInMenu: true,
				requiredAuth: false,
				localeName: 'pages.home.title.menu',
			},
		},
		...authRoutes,
		shopRoutes,
		{
			path: '/cart',
			name: 'cart',
			component: () => import('@/pages/cart/CartPage.vue'),
			meta: {
				useInMenu: false,
				requiredAuth: false,
				localeName: 'pages.cart.title.page',
			},
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'notFound',
			component: () => import('@/pages/NotFoundPage.vue'),
		},
	],
})

// router.beforeEach(async (to, from) => {
// 	if (document.documentElement.classList.contains('menu-open')) {
// 		document.documentElement.classList.remove('menu-open')
// 	}
// 	return true
// })

router.afterEach((to, from) => {
	const commonStore = useCommonStore()
	const { isHeaderMenuOpen } = storeToRefs(commonStore)
	const { toggleHeaderMenu } = commonStore

	if (isHeaderMenuOpen.value) {
		toggleHeaderMenu()
	}
})
export default router
