const API_VERSION = import.meta.env.VUE_APP_API_VERSION

export const API_BASE =
	import.meta.env.VUE_APP_API_BASE || 'http://localhost:3000'
export const PUBLIC_IMAGES = `${API_BASE}`
export const API_URL = `${API_BASE}/api/${API_VERSION}`
