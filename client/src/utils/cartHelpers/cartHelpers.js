/**
 * Build a canonical key string for a cart item.
 * Format: "productId|variantId|sizeId|quantity" (when includeQuantity = true).
 * @param {Object} item
 * @param {boolean} [isPopulated=false] - true when item uses populated relations (objects).
 * @param {boolean} [includeQuantity=true]
 * @returns {string}
 */

export function makeKeyFromCartItem(
	item = {},
	isPopulatedCart = false,
	includeQuantity = true,
) {
	const productId = isPopulatedCart
		? (item.productId ?? '')
		: (item.product ?? '')

	const variantId = item.variant ?? ''

	const sizeId = isPopulatedCart
		? ((item.size && item.size._id) ?? item.size ?? '')
		: (item.size ?? '')

	const quantity = item.quantity ?? 1

	return includeQuantity
		? `${productId}|${variantId}|${sizeId}|${quantity}`
		: `${productId}|${variantId}|${sizeId}`
}

/**
 * Create a Set of canonical keys (keys include quantity).
 * @param {Array<Object>} items
 * @param {boolean} [isPopulated=false]
 * @returns {Set<string>}
 */

export function createSet(
	items,
	isPopulatedCart = false,
	includeQuantity = false,
) {
	const set = new Set()

	if (!Array.isArray(items)) return set

	for (const i of items) {
		const value = makeKeyFromCartItem(i, isPopulatedCart, includeQuantity)
		set.add(value)
	}
	return set
}

/**
 * Create a Map keyed by canonical item key (without quantity) to quantity number.
 * Key format: "productId|variantId|sizeId" -> quantity
 * @param {Array<Object>} items
 * @param {boolean} [isPopulated=false]
 * @returns {Map<string, number>}
 */
export function createMap(items) {
	const map = new Map()

	if (!Array.isArray(items)) return map

	for (const i of items) {
		const key = makeKeyFromCartItem(i)
		const quantity = i.quantity ?? 1
		map.set(key, quantity)
	}
	return map
}

/**
 * Sync quantities from plain cartItems into populatedCartItems.
 * Returns a new array; preserves original object references when quantity is unchanged.
 * @param {Array<Object>} cartItems - source of truth for quantities
 * @param {Array<Object>} populatedCartItems - items with populated relations
 * @returns {Array<Object>}
 */
export function syncProductsQuantity(cartItems, populatedCart) {
	const cartItemsMap = createMap(cartItems)

	return populatedCart?.map((i) => {
		const key = makeKeyFromCartItem(i, true)
		const quantity = cartItemsMap.has(key)
			? cartItemsMap.get(key)
			: (i.quantity ?? 1)

		if (i.quantity === quantity) return i
		return { ...i, quantity }
	})
}

/**
 * Compare two Sets for exact equality (same values).
 * @param {Set<string>} setA
 * @param {Set<string>} setB
 * @returns {boolean}
 */
export function compareCartItems(cartItems, populatedCart) {
	const setA = createSet(cartItems, false, true)
	const setB = createSet(populatedCart, true, true)

	if (setA.size !== setB.size) return false

	for (const value of setA) {
		if (!setB.has(value)) return false
	}

	return true
}
