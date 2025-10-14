import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

import routeNames from '@/router/routeNames'
import { i18nMeta } from '@/config/i18n'
import shopConstants from '@/constants/shop'

/**
 * Syncs locale, cart, and auth state across browser tabs using localStorage events.
 *
 * @returns {Object} Methods
 * @property {Function} setLocale(lang: string): void - Apply locale and update route.
 * @property {Function} onStorageEvent(e: StorageEvent): void - Handle storage event updates.
 */

export function useStorage() {
	const { locale } = useI18n()
	const router = useRouter()
	const route = useRoute()
	const { initCart } = useCartStore()
	const { setToken, getUserProfileByToken, signout } = useAuthStore()

	function setLocale(lang) {
		if (!lang) {
			locale.value = i18nMeta.defaultLocale
			return
		}

		if (locale.value !== lang) {
			locale.value = lang
		}
		if (route.params.locale !== lang) {
			router.replace({
				name: route.name || routeNames.HOME,
				params: { ...route.params, locale: lang },
				query: route.query,
			})
		}
	}
	function onLocaleStorageChange(e) {
		const { newValue } = e

		setLocale(newValue)
	}
	function onCartStorageChange(e) {
		if (!e.newValue) {
			return
		}
		const cartData = JSON.parse(e.newValue)
		initCart(cartData)
	}
	function onAuthStorageChange(e) {
		if (!e.newValue) {
			signout()
			return
		}
		if (e.newValue === e.oldValue) return

		setToken(e.newValue)
		getUserProfileByToken()
	}
	function onStorageEvent(e) {
		if (!e) return

		switch (e.key) {
			case shopConstants.storageKeys.locale:
				onLocaleStorageChange(e)
				break
			case shopConstants.storageKeys.cart:
				onCartStorageChange(e)
				break
			case shopConstants.storageKeys.token:
				onAuthStorageChange(e)
				break
			default:
				break
		}
	}

	return {
		setLocale,
		onStorageEvent,
	}
}
