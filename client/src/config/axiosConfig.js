import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { i18n } from '@/plugins/i18n'
import router from '@/router'
import { API_URL } from './apiConfig'
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from './appConfig'

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
		const locale = i18n?.global.locale.value ?? DEFAULT_LOCALE
		const currency =
			i18n?.global.numberFormats.value[locale].currency.currency ??
			DEFAULT_CURRENCY

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
			authStore.signout()
			router.push({ name: 'signin' })
		}
		if (error.response?.status === 403) {
			router.push({ name: 'not-found-page' })
		}
		return Promise.reject(error)
	},
)

export default apiClient
