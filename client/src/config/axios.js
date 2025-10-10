import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { i18n } from '@/plugins/i18n'
import { i18nMeta } from './i18n'
import routeNames from '@/router/routeNames'
import apiConfig from './api'

const apiClient = axios.create({
	baseURL: apiConfig.apiUrl,
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
		const locale = i18n?.global.locale.value ?? i18nMeta.defaultLocale
		const currency =
			i18n?.global.numberFormats.value[locale].currency.currency ??
			i18nMeta.defaultCurrency
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
			router.push({ name: routeNames.signin })
		}
		if (error.response?.status === 403) {
			router.push({ name: routeNames.NOT_FOUND })
		}
		return Promise.reject(error)
	},
)

export default apiClient
