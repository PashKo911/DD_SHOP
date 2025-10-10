import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'

import authRoutes from './routes/auth'
import shopRoutes from './routes/shop'

import { useCommonStore } from '@/stores/common'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

import routeNames from './routeNames'

import detectLocale from '@/utils/localeHelpers/detectLocale'
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
			redirect: { name: routeNames.HOME },
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
				params: { locale: i18nMeta.defaultLocale },
			},
		},
	],
})

router.beforeEach(async (to, from, next) => {
	const detectedLocale = detectLocale(to)
	const authStore = useAuthStore()
	const cartStore = useCartStore()
	const { isCartInitialized, isInitCartLoading } = storeToRefs(cartStore)
	const { initCart } = cartStore
	const { isAuthenticated, token } = storeToRefs(authStore)
	const { getUserProfileByToken } = authStore

	if (!isAuthenticated.value && token.value) {
		await getUserProfileByToken()
	}

	if (!isCartInitialized.value && !isInitCartLoading.value) {
		initCart()
	}

	if (to.params.locale === detectedLocale) {
		return next()
	}

	return next({
		name: to.name || routeNames.HOME,
		params: { ...to.params, locale: detectedLocale },
		query: to.query,
	})
})

router.afterEach((to, from) => {
	const commonStore = useCommonStore()
	const { isHeaderMenuOpen } = storeToRefs(commonStore)
	const { toggleHeaderMenu } = commonStore

	if (isHeaderMenuOpen.value) {
		toggleHeaderMenu()
	}
})
export default router
