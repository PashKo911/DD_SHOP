import axios from 'axios'
import { storeToRefs } from 'pinia'

import router from '@/router'
import { useCommonStore } from '@/stores/common'
import routeNames from '@/router/routeNames'
import apiConfig from './api'

import { getAccessToken, setTokens, clearTokens } from '@/utils/auth/token'
import apiEndpoints from '@/api/apiEndpoints'
import { errorCodes } from '@/constants/errorCodes'

const apiClient = axios.create({
	baseURL: apiConfig.apiUrl,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
})

let onLogout = null
let refreshPromise = null

export const setOnLogout = (handler) => {
	onLogout = handler
}

apiClient.interceptors.request.use(
	(config) => {
		const accessToken = getAccessToken()

		if (accessToken) {
			config.headers = config.headers || {}
			config.headers.Authorization = `Bearer ${accessToken}`
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
	async (error) => {
		const originalRequest = error.config

		if (!originalRequest) {
			return Promise.reject(error)
		}

		const status = error.response?.status
		const code = error.response?.data?.code

		const shouldRefresh =
			status === 401 &&
			code === errorCodes.INVALID_ACCESS_TOKEN &&
			!originalRequest._retry

		if (shouldRefresh) {
			originalRequest._retry = true

			try {
				if (!refreshPromise) {
					refreshPromise = apiClient
						.post(apiEndpoints.auth.refresh)
						.then((response) => {
							const token = response.data?.data?.accessToken

							if (token) {
								setTokens({ accessToken: token })
							}

							return token ?? null
						})
						.finally(() => {
							refreshPromise = null
						})
				}

				const newAccessToken = await refreshPromise

				if (!newAccessToken) {
					throw new Error('No refresh token or session expired')
				}

				originalRequest.headers = originalRequest.headers || {}
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

				return apiClient(originalRequest)
			} catch (refreshError) {
				clearTokens()
				onLogout?.()

				router.push({ name: routeNames.AUTH })

				return Promise.reject(refreshError)
			}
		}

		if (status === 403) {
			router.push({ name: routeNames.NOT_FOUND })
			return null
		}

		return Promise.reject(error)
	},
)

export default apiClient
