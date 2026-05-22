import Decimal from 'decimal.js'
import getDiscountPercent from '../number/getDiscountPercent.mjs'
import toDecimal from '../number/toDecimal.mjs'

const convertPrice = (valueDec, rateDec) => {
	if (!valueDec || !rateDec) return null

	return valueDec.mul(rateDec).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber()
}

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

		return {
			...v,
			price: convertPrice(priceDec, rateDec),
			oldPrice: convertPrice(oldPriceDec, rateDec),
			discount: getDiscountPercent(oldPriceDec, priceDec),
			color: {
				...v.color,
				label: v.color.label[language],
			},
		}
	})

	const minPriceDec = toDecimal(product?.minPrice)
	const maxPriceDec = toDecimal(product?.maxPrice)
	const priceDec = toDecimal(product?.price)

	return {
		...product,

		price: convertPrice(priceDec, rateDec),
		minPrice: convertPrice(minPriceDec, rateDec),
		maxPrice: convertPrice(maxPriceDec, rateDec),

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
