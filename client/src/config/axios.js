import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { useCommonStore } from '@/stores/common'
import { i18n } from '@/plugins/i18n'
import { i18nMeta } from './i18n'
import routeNames from '@/router/routeNames'
import apiConfig from './api'
import { storeToRefs } from 'pinia'

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
		const commonStore = useCommonStore()
		const { locale, currency } = storeToRefs(commonStore)
		config.headers = {
			...config.headers,
			'Accept-Language': locale.value,
			Currency: currency.value,
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
