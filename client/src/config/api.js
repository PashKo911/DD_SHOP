const apiVersion = import.meta.env.VITE_API_VERSION ?? 'v1'
const apiBase = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'

const apiConfig = Object.freeze({
	googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
	apiVersion,
	apiBase,
	apiUrl: `${apiBase}/api/${apiVersion}`,
	siteBase: import.meta.env.VITE_SITE_URL ?? window.location.origin,
})

export default apiConfig
