import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import authRoutes from './routes/authRoutes'
import shopRoutes from './routes/shopRoutes'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
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

export default router
