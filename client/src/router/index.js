import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/home/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import authRoutes from './routes/authRoutes'
import shopRoutes from './routes/shopRoutes'

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
			component: HomePage,
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
		{ path: '/:pathMatch(.*)*', name: 'notFound', component: NotFoundPage },
	],
})

// router.beforeEach(async (to, from) => {
// 	if (document.documentElement.classList.contains('menu-open')) {
// 		document.documentElement.classList.remove('menu-open')
// 	}
// 	return true
// })

router.afterEach((to, from) => {
	if (document.documentElement.classList.contains('menu-open')) {
		document.documentElement.classList.remove('menu-open')
	}
})
export default router
