import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import WomenPage from '@/pages/WomenPage.vue'
import MenPage from '@/pages/MenPage.vue'
import SignInPage from '@/pages/SignInPage.vue'
import CartPage from '@/pages/CartPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			redirect: { name: 'shop' },
			meta: {
				useInMenu: false,
				requiredAuth: false,
			},
		},
		{
			path: '/shop',
			name: 'shop',
			component: HomePage,
			meta: {
				useInMenu: true,
				requiredAuth: false,
				localeName: 'menu.shop',
			},
		},
		{
			path: '/women',
			name: 'women',
			component: WomenPage,
			meta: {
				useInMenu: true,
				requiredAuth: false,
				localeName: 'menu.women',
			},
		},
		{
			path: '/men',
			name: 'men',
			component: MenPage,
			meta: {
				useInMenu: true,
				requiredAuth: false,
				localeName: 'menu.men',
			},
		},
		{
			path: '/signIn',
			name: 'signIn',
			component: SignInPage,
			meta: {
				useInMenu: false,
				requiredAuth: false,
			},
		},
		{
			path: '/cart',
			name: 'cart',
			component: CartPage,
			meta: {
				useInMenu: false,
				requiredAuth: false,
			},
		},
		{ path: '/:pathMatch(.*)*', name: 'notFound', component: NotFoundPage },
	],
})

export default router
