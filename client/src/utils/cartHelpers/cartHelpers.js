/**
 * Build a canonical key string for a cart item.
 * Format: "productId|variantId|sizeId|amount" (when includeAmount = true).
 * @param {Object} item
 * @param {boolean} [isPopulated=false] - true when item uses populated relations (objects).
 * @param {boolean} [includeAmount=true]
 * @returns {string}
 */

export function makeKeyFromCartItem(
	item = {},
	isPopulatedCart = false,
	includeAmount = true,
) {
	const productId = isPopulatedCart
		? (item.productId ?? '')
		: (item.product ?? '')

	const variantId = item.variant ?? ''

	const sizeId = isPopulatedCart
		? ((item.size && item.size._id) ?? item.size ?? '')
		: (item.size ?? '')

	const amount = item.amount ?? 1

	return includeAmount
		? `${productId}|${variantId}|${sizeId}|${amount}`
		: `${productId}|${variantId}|${sizeId}`
}

/**
 * Create a Set of canonical keys (keys include amount).
 * @param {Array<Object>} items
 * @param {boolean} [isPopulated=false]
 * @returns {Set<string>}
 */

export function createSet(
	items,
	isPopulatedCart = false,
	includeAmount = false,
) {
	const set = new Set()

	if (!Array.isArray(items)) return set

	for (const i of items) {
		const value = makeKeyFromCartItem(i, isPopulatedCart, includeAmount)
		set.add(value)
	}
	return set
}

/**
 * Create a Map keyed by canonical item key (without amount) to amount number.
 * Key format: "productId|variantId|sizeId" -> amount
 * @param {Array<Object>} items
 * @param {boolean} [isPopulated=false]
 * @returns {Map<string, number>}
 */
export function createMap(items) {
	const map = new Map()

	if (!Array.isArray(items)) return map

	for (const i of items) {
		const key = makeKeyFromCartItem(i)
		const amount = i.amount ?? 1
		map.set(key, amount)
	}
	return map
}

/**
 * Sync amounts from plain cartItems into populatedCartItems.
 * Returns a new array; preserves original object references when amount is unchanged.
 * @param {Array<Object>} cartItems - source of truth for amounts
 * @param {Array<Object>} populatedCartItems - items with populated relations
 * @returns {Array<Object>}
 */
export function syncProductsAmount(cartItems, populatedCart) {
	const cartItemsMap = createMap(cartItems)

	return populatedCart?.map((i) => {
		const key = makeKeyFromCartItem(i, true)
		const amount = cartItemsMap.has(key)
			? cartItemsMap.get(key)
			: (i.amount ?? 1)

		if (i.amount === amount) return i
		return { ...i, amount }
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
