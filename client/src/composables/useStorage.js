import { useCartStore } from '@/stores/cart'
import { useCommonStore } from '@/stores/common'

import shopConstants from '@/constants/shop'

/**
 * Syncs cart and currency state across browser tabs using localStorage events.
 *
 * @returns {Object} Methods
 * @property {Function} onStorageEvent(e: StorageEvent): void - Handle storage event updates.
 */

export function useStorage() {
	const { initCart } = useCartStore()
	const { setCurrency } = useCommonStore()

	function onCartChange(e) {
		if (!e.newValue) {
			return
		}
		const cartData = JSON.parse(e.newValue)
		initCart(cartData)
	}

	function onStorageEvent(e) {
		if (!e) return

		switch (e.key) {
			case shopConstants.storageKeys.currency:
				setCurrency(e.newValue)
				break
			case shopConstants.storageKeys.cart:
				onCartChange(e)
				break

			default:
				break
		}
	}

	return {
		onStorageEvent,
	}
}
