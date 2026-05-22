export const formatPriceRange = (minPrice, maxPrice, fallback = '-') => {
	if (minPrice == null && maxPrice == null) return fallback

	if (minPrice === maxPrice || maxPrice == null) {
		return minPrice ?? fallback
	}

	if (minPrice == null) return maxPrice
	if (maxPrice == null) return minPrice

	return `${minPrice} - ${maxPrice}`
}
