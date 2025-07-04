import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import i18n from '@/plugins/i18n'
import router from '@/router'

const API_VERSION = import.meta.env.VITE_APP_API_VERSION

const API_BASE = import.meta.env.VITE_APP_API_BASE || 'http://localhost:3000'

const API_URL = `${API_BASE}/api/${API_VERSION}`

const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

apiClient.interceptors.request.use(
	(config) => {
		const authStore = useAuthStore()
		const token = authStore.token
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => Promise.reject(error),
)

apiClient.interceptors.request.use(
	(config) => {
		const locale = i18n.global.locale.value
		const { currency } = i18n.global.numberFormats.value[locale].currency
		config.headers = {
			...config.headers,
			'Accept-Language': locale,
			Currency: currency,
		}
		return config
	},
	(error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			const authStore = useAuthStore()
			authStore.logout()
		}
		if (error.response?.status === 403) {
			router.push({ name: 'not-found-page' })
		}
		return Promise.reject(error)
	},
)

export default apiClient
