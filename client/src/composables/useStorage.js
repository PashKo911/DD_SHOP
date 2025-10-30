import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useCommonStore } from '@/stores/common'

import shopConstants from '@/constants/shop'

/**
 * Syncs locale, cart, and auth state across browser tabs using localStorage events.
 *
 * @returns {Object} Methods
 * @property {Function} setLocale(lang: string): void - Apply locale and update route.
 * @property {Function} onStorageEvent(e: StorageEvent): void - Handle storage event updates.
 */

export function useStorage() {
	const { initCart } = useCartStore()
	const { setToken, getUserProfileByToken, signout } = useAuthStore()
	const { setLocale, setCurrency } = useCommonStore()

	function onCartChange(e) {
		if (!e.newValue) {
			return
		}
		const cartData = JSON.parse(e.newValue)
		initCart(cartData)
	}
	function onAuthChange(e) {
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
				setLocale(e.newValue)
				break
			case shopConstants.storageKeys.currency:
				setCurrency(e.newValue)
				break
			case shopConstants.storageKeys.cart:
				onCartChange(e)
				break
			case shopConstants.storageKeys.token:
				onAuthChange(e)
				break

			default:
				break
		}
	}

	return {
		onStorageEvent,
	}
}
