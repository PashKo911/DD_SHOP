import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'

import authRoutes from './routes/auth'
import shopRoutes from './routes/shop'
import dashboardRoutes from './routes/dashboard'

import { useCommonStore } from '@/stores/common'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

import routeNames from './routeNames'
import { canAccessRoute } from '@/utils/routing/canAccessRoute'

import { defaultLocale } from '@/config/i18n'

const appInnerRoutes = [
	{
		path: 'home',
		name: routeNames.HOME,
		component: () => import('@/pages/home/HomePage.vue'),
		meta: {
			useInMenu: true,
			requiredAuth: false,
			localeName: 'pages.home.title.menu',
		},
	},
	...authRoutes,
	shopRoutes,
	...dashboardRoutes,
	{
		path: 'cart',
		name: routeNames.CART,
		component: () => import('@/pages/cart/CartPage.vue'),
		meta: {
			useInMenu: false,
			requiredAuth: false,
			localeName: 'pages.cart.title.page',
		},
	},
	{
		path: ':pathMatch(.*)*',
		name: routeNames.NOT_FOUND,
		component: () => import('@/pages/NotFoundPage.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	scrollBehavior(to, from) {
		const nameFrom = from.name
		const nameTo = to.name

		if (nameFrom === nameTo) {
			return { left: 0, top: 0, behavior: 'smooth' }
		}
		return { top: 0, left: 0 }
	},
	routes: [
		{
			path: '/',
			redirect: { name: routeNames.HOME, params: { locale: defaultLocale } },
			meta: {
				useInMenu: false,
				requiredAuth: false,
			},
		},

		{
			path: '/:locale(en|uk)?',
			children: appInnerRoutes,
		},

		{
			path: '/:pathMatch(.*)*',
			redirect: {
				name: routeNames.NOT_FOUND,
				params: { locale: defaultLocale },
			},
		},
	],
})

router.beforeEach((to) => {
	const authStore = useAuthStore()

	if (!authStore.isAuthResolved) {
		return true
	}

	if (to.meta.guestOnly && authStore.isAuthenticated) {
		return { name: routeNames.HOME }
	}

	if (to.meta.requiredAuth && !authStore.isAuthenticated) {
		return { name: routeNames.SIGNIN }
	}

	if (!canAccessRoute(to, authStore.userRole)) {
		return { name: routeNames.HOME }
	}

	return true
})

router.beforeEach((to) => {
	const cartStore = useCartStore()
	const { isCartInitialized, isInitCartLoading } = storeToRefs(cartStore)
	const { initCart } = cartStore

	if (!isCartInitialized.value && !isInitCartLoading.value) {
		initCart()
	}

	return true
})

router.afterEach(() => {
	const commonStore = useCommonStore()
	const { isHeaderMenuOpen } = storeToRefs(commonStore)
	const { toggleHeaderMenu } = commonStore

	if (isHeaderMenuOpen.value) {
		toggleHeaderMenu()
	}
})

export default router
