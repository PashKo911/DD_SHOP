export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export const API_VERSION = import.meta.env.VITE_API_VERSION ?? 'v1'

export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'

export const API_URL = `${API_BASE}/api/${API_VERSION}`

export const SITE_BASE = import.meta.env.VITE_SITE_URL ?? window.location.origin
