/**
 * Calculate discount percentage between an old price and the current price.
 *
 * Returns a human-readable percentage string like "-20%" when there is a positive
 * discount (oldPrice > price). If there is no valid discount (oldPrice is falsy,
 * equal to or less than price), the function returns `null`.
 *
 * @param {number|null|undefined} oldPrice - The previous price (original price). If falsy or not greater than `price`, no discount is returned.
 * @param {number} price - The current price.
 * @returns {string|null} A string in the format "-{N}%" where N is the rounded discount percentage,
 *                        or `null` if there is no discount.
 *
 **/

const getDiscount = (oldPrice, price) => {
	if (!oldPrice || oldPrice <= price) return null
	const discountValue = Math.round(((oldPrice - price) / oldPrice) * 100)
	return `-${discountValue}%`
}

export default getDiscount
