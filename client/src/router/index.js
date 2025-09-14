import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'

import authRoutes from './routes/authRoutes'
import shopRoutes from './routes/shopRoutes'

import { useCommonStore } from '@/stores/commonStore'
import { useAuthStore } from '@/stores/auth'

import detectLocale from '@/utils/localeHelpers/detectLocale'
import { DEFAULT_LOCALE } from '@/config/appConfig'

const appInnerRoutes = [
	{
		path: 'home',
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
		path: 'cart',
		name: 'cart',
		component: () => import('@/pages/cart/CartPage.vue'),
		meta: {
			useInMenu: false,
			requiredAuth: false,
			localeName: 'pages.cart.title.page',
		},
	},
	{
		path: ':pathMatch(.*)*',
		name: 'notFound',
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
			redirect: { name: 'home' },
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
			redirect: { name: 'notFound', params: { locale: DEFAULT_LOCALE } },
		},
	],
})

router.beforeEach(async (to, from, next) => {
	const detectedLocale = detectLocale(to)
	const authStore = useAuthStore()
	const { isAuthenticated, token } = storeToRefs(authStore)
	const { getUserProfileByToken } = authStore

	if (!isAuthenticated.value && token.value) {
		await getUserProfileByToken()
	}

	if (to.params.locale === detectedLocale) {
		return next()
	}

	return next({
		name: to.name || 'home',
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
