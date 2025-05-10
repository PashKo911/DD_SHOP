const getDiscount = (oldPrice, price) => {
	if (!oldPrice || oldPrice <= price) return null
	const discountValue = Math.round(((oldPrice - price) / oldPrice) * 100)
	return `-${discountValue}%`
}

export default getDiscount
