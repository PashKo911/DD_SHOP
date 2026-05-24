import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { useGeneralStore } from './general'
import { useCartStore } from './cart'

import { userRoles } from '@/constants/roles'
import apiClient, { setOnLogout } from '@/config/axios'
import apiEndpoints from '@/api/apiEndpoints'
import serverErrorsFormatter from '@/utils/errors/serverErrorsFormatter'
import supportedAuthErrorCodes from '@/constants/authErrorCodes'
import { clearTokens, setTokens } from '@/utils/auth/token'

export const useAuthStore = defineStore('auth', () => {
	const generalStore = useGeneralStore()
	const { initCart } = useCartStore()
	const { generalApiOperation, isLoading, hasError, clearError } = generalStore

	const user = ref(null)
	const isAuthResolved = ref(false)

	//========================================================================================================================================================

	const userRole = computed(() => user.value?.type?.name || userRoles.user)

	const isAuthenticated = computed(() => Boolean(user.value))

	const isSignupLoading = computed(() => isLoading('signup'))

	const signupServerValidationErrors = computed(() => {
		const axiosErr = hasError('signup')
		return serverErrorsFormatter(axiosErr, supportedAuthErrorCodes)
	})

	const isSigninLoading = computed(() => isLoading('signin'))

	const signinServerValidationErrors = computed(() => {
		const axiosErr = hasError('signin')
		return serverErrorsFormatter(axiosErr, supportedAuthErrorCodes)
	})
	//========================================================================================================================================================

	const clearAuthState = () => {
		clearTokens()
		user.value = null
	}

	const applyAuthResponse = (data) => {
		if (data?.accessToken) {
			setTokens({ accessToken: data.accessToken })
		}
		if (data?.user) {
			user.value = data.user
		}
		isAuthResolved.value = true
	}

	const handleLogout = () => {
		clearAuthState()
	}

	setOnLogout(handleLogout)

	const initialize = async () => {
		if (isAuthResolved.value) return user.value

		try {
			const refreshResponse = await apiClient.post(apiEndpoints.auth.refresh)

			const accessToken = refreshResponse.data?.data?.accessToken
			if (!accessToken) {
				clearAuthState()
				return null
			}

			setTokens({ accessToken })

			const profileResponse = await apiClient.get(apiEndpoints.auth.profile)
			user.value = profileResponse.data.user

			return user.value
		} catch {
			clearAuthState()
			return null
		} finally {
			isAuthResolved.value = true
		}
	}

	const signinWithGoogle = async (googleAuthCode, { successCallback }) => {
		const result = await generalApiOperation({
			operationName: 'signinWithGoogle',
			operation: async () => {
				const response = await apiClient.post(
					apiEndpoints.auth.authWithGoogle,
					{
						code: googleAuthCode.code,
					},
				)
				return response
			},
			successCallback,
		})
		applyAuthResponse(result.data)
		initCart()
	}

	const signin = async ({ email, password }, successCallback) => {
		return generalApiOperation({
			operationName: 'signin',
			operation: async () => {
				const response = await apiClient.post(apiEndpoints.auth.signin, {
					email,
					password,
				})

				applyAuthResponse(response.data)
				initCart()
			},
			successCallback,
		})
	}

	const signup = async ({ email, password }, successCallback) => {
		return generalApiOperation({
			operationName: 'signup',
			operation: async () => {
				const response = await apiClient.post(apiEndpoints.auth.signup, {
					email,
					password,
				})

				applyAuthResponse(response.data)
				initCart()
			},
			successCallback,
		})
	}

	const signout = async () => {
		try {
			await apiClient.post(apiEndpoints.auth.logout)
		} catch {
			console.warn('Logout request failed', error)
		} finally {
			clearAuthState()
		}
	}

	const clearSigninErrors = () => {
		clearError('signin')
	}

	const clearSignupErrors = () => {
		clearError('signup')
	}

	return {
		user,
		isAuthResolved,
		userRole,
		isAuthenticated,
		signupServerValidationErrors,
		signinServerValidationErrors,
		isSignupLoading,
		isSigninLoading,
		initialize,
		signin,
		signinWithGoogle,
		signup,
		signout,
		clearSigninErrors,
		clearSignupErrors,
	}
})
