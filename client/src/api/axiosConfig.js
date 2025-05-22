import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
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
		config.headers['Accept-Language'] = locale
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
