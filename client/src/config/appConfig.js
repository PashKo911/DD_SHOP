import sortOptionsData from '@/data/sortOptionsData'

export const SHOP_CATEGORIES = ['women', 'men']

export const DEFAULT_CATEGORY = SHOP_CATEGORIES[0]

export const DEFAULT_LOCALE = 'en'

export const DEFAULT_SORT = sortOptionsData.find(
	(o) => o.value === 'maxRating:desc',
)
