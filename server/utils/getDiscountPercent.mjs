import Decimal from 'decimal.js'
/**
 * Returns discount % between old and current price.
 * If no valid discount, returns 0.
 *
 * @param {Decimal} oldPriceDec - Old price.
 * @param {Decimal} priceDec - Current price.
 * @returns {Decimal|0} Discount percent (rounded) or 0.
 */

function getDiscountPercent(oldPriceDec, priceDec) {
	if (!oldPriceDec) return 0
	if (oldPriceDec.lte(priceDec)) return 0

	return oldPriceDec.sub(priceDec).div(oldPriceDec).mul(100).toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
}

export default getDiscountPercent
