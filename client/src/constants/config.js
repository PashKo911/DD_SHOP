import sortOptionsData from '@/data/sortOptionsData'

export const API_VERSION = import.meta.env.VITE_API_VERSION ?? 'v1'

export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'

export const API_URL = `${API_BASE}/api/${API_VERSION}`

export const SITE_BASE = import.meta.env.VITE_SITE_URL ?? window.location.origin

export const SHOP_CATEGORIES = ['women', 'men']

export const DEFAULT_CATEGORY = SHOP_CATEGORIES[0]

export const DEFAULT_LOCALE = 'en'

export const DEFAULT_SORT = sortOptionsData[3]
