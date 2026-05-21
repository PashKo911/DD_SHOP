import Decimal from 'decimal.js'
import getDiscountPercent from '../number/getDiscountPercent.mjs'
import toDecimal from '../number/toDecimal.mjs'

/**
 * Localize product and apply exchange rate.
 * @param {Object} product
 * @param {string} language
 * @param {number|Decimal|null} rate
 * @returns {Object} localized product
 */

function formatProductForResponse(product, language, rate) {
	const rateDec = toDecimal(rate)
	const variants = Array.isArray(product.variants) ? product.variants : []

	const formattedVariants = variants.map((v) => {
		const priceDec = toDecimal(v?.price)
		const oldPriceDec = toDecimal(v?.oldPrice)

		const exchangedDec =
			priceDec && rateDec ? priceDec.mul(rateDec).toDecimalPlaces(2, Decimal.ROUND_HALF_UP) : null
		const exchangedOldDec =
			oldPriceDec && rateDec ? oldPriceDec.mul(rateDec).toDecimalPlaces(2, Decimal.ROUND_HALF_UP) : null

		const price = exchangedDec ? exchangedDec.toNumber() : null
		const oldPrice = exchangedOldDec ? exchangedOldDec.toNumber() : null
		return {
			...v,
			oldPrice,
			price,
			discount: getDiscountPercent(oldPriceDec, priceDec),
			color: { ...v.color, label: v.color.label[language] },
		}
	})

	return {
		...product,
		variants: formattedVariants,
		title: product.title[language],
		description: product.description[language],
		style: {
			...product.style,
			label: product.style.label[language],
		},
	}
}

export default formatProductForResponse
