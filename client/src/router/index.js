import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'

import authRoutes from './routes/auth'
import shopRoutes from './routes/shop'
import dashboardRoutes from './routes/dashboard'
import accountRoutes from './routes/account'

import { useCommonStore } from '@/stores/common'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

import routeNames from './routeNames'
import { canAccessRoute } from '@/utils/routing/canAccessRoute'
import { getRouteLocale } from '../utils/locale/getRouteLocale'

import { i18nMeta } from '@/config/i18n'

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
	...accountRoutes,
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
			redirect: {
				name: routeNames.HOME,
				params: { locale: i18nMeta.defaultLocale },
			},
			meta: {
				useInMenu: false,
				requiredAuth: false,
			},
		},

		{
			path: `/${i18nMeta.localeRouteParam}`,
			children: [
				{
					path: '',
					redirect: (to) => ({
						name: routeNames.HOME,
						params: { locale: getRouteLocale(to) },
					}),
				},
				...appInnerRoutes,
			],
		},

		{
			path: '/:pathMatch(.*)*',
			redirect: {
				name: routeNames.NOT_FOUND,
				params: { locale: i18nMeta.defaultLocale },
			},
		},
	],
})

router.beforeEach((to) => {
	const commonStore = useCommonStore()

	commonStore.setLocale(getRouteLocale(to))

	return true
})

router.beforeEach(async (to) => {
	const authStore = useAuthStore()
	const locale = getRouteLocale(to)
	const needsResolvedAuth =
		Boolean(to.meta.requiredAuth) ||
		Boolean(to.meta.guestOnly) ||
		Array.isArray(to.meta.roles)

	if (!authStore.isAuthResolved && needsResolvedAuth) {
		await authStore.initialize()
	}

	if (to.meta.guestOnly && authStore.isAuthenticated) {
		return { name: routeNames.HOME, params: { locale } }
	}

	if (to.meta.requiredAuth && !authStore.isAuthenticated) {
		return { name: routeNames.SIGNIN, params: { locale } }
	}

	if (!canAccessRoute(to, authStore.userRole)) {
		return { name: routeNames.HOME, params: { locale } }
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
