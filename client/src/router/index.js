import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import WomenPage from '@/pages/WomenPage.vue'
import MenPage from '@/pages/MenPage.vue'
import CartPage from '@/pages/cart/CartPage.vue'
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
				localeName: 'partials.pageTitles.shop',
			},
		},
		{
			path: '/women',
			name: 'women',
			component: WomenPage,
			meta: {
				useInMenu: true,
				requiredAuth: false,
				localeName: 'partials.pageTitles.women',
			},
		},
		{
			path: '/men',
			name: 'men',
			component: MenPage,
			meta: {
				useInMenu: true,
				requiredAuth: false,
				localeName: 'partials.pageTitles.men',
			},
		},
		{
			path: '/auth',
			redirect: { name: 'signIn' },
			meta: {
				useInMenu: false,
				requiredAuth: false,
			},
		},
		{
			path: '/auth/sign-in',
			name: 'signIn',
			component: () => import('@/pages/signIn/SignInPage.vue'),
			meta: {
				useInMenu: false,
				requiredAuth: false,
			},
		},
		{
			path: '/auth/sign-up',
			name: 'signUp',
			component: () => import('@/pages/signUp/SignUpPage.vue'),
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
				localeName: 'partials.pageTitles.cart',
			},
		},
		{ path: '/:pathMatch(.*)*', name: 'notFound', component: NotFoundPage },
	],
})

export default router
