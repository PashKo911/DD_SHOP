import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { useGeneralStore } from './general'
import { useUsersStore } from './users'
import { useCartStore } from './cart'

import apiClient from '@/config/axios'
import apiEndpoints from '@/api/apiEndpoints'
import serverErrorsFormatter from '@/utils/errorHelpers/serverErrorsFormatter'
import supportedAuthErrorCodes from '@/constants/authErrorCodes'

export const useAuthStore = defineStore('auth', () => {
	const generalStore = useGeneralStore()
	const { initCart } = useCartStore()
	const usersStore = useUsersStore()
	const { generalApiOperation, isLoading, hasError, clearError } = generalStore

	const user = ref(null)
	const token = ref(localStorage.getItem('token') || null)
	//========================================================================================================================================================

	const currentUserPermissions = computed(() => user.value?.permissions || {})

	const isAuthenticated = computed(() => {
		return Boolean(user.value)
	})

	const isSignupLoading = computed(() => {
		return isLoading('signup')
	})

	const signupServerValidationErrors = computed(() => {
		const axiosErr = hasError('signup')
		return serverErrorsFormatter(axiosErr, supportedAuthErrorCodes)
	})

	const isSigninLoading = computed(() => {
		return isLoading('signin')
	})

	const signinServerValidationErrors = computed(() => {
		const axiosErr = hasError('signin')
		return serverErrorsFormatter(axiosErr, supportedAuthErrorCodes)
	})

	//========================================================================================================================================================

	const setToken = (newToken) => {
		token.value = newToken
		if (newToken) {
			localStorage.setItem('token', newToken)
		} else {
			localStorage.removeItem('token')
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
		user.value = result.data.user
		setToken(result.data.token)
		initCart()
	}

	const getUserProfileByToken = async () => {
		if (!token.value) return null
		return generalApiOperation({
			operationName: 'getUserProfileByToken',
			operation: async () => {
				const response = await apiClient.get(apiEndpoints.auth.profileByToken)

				user.value = response.data.user
				return response.data.user
			},
		})
	}

	const signin = async ({ email, password }, successCallback) => {
		return generalApiOperation({
			operationName: 'signin',
			operation: async () => {
				const response = await apiClient.post(apiEndpoints.auth.signin, {
					email,
					password,
				})

				setToken(response.data.token)
				user.value = response.data.user
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

				setToken(response.data.token)
				user.value = response.data.user
				initCart()
			},
			successCallback,
		})
	}

	const signout = () => {
		setToken(null)
		user.value = null
	}

	const clearSigninErrors = () => {
		clearError('signin')
	}

	const clearSignupErrors = () => {
		clearError('signup')
	}

	return {
		// refs
		user,
		token,

		// computed
		currentUserPermissions,
		isAuthenticated,
		signupServerValidationErrors,
		signinServerValidationErrors,

		// status
		isSignupLoading,
		isSigninLoading,

		// actions
		getUserProfileByToken,
		signin,
		signinWithGoogle,
		signup,
		signout,
		clearSigninErrors,
		clearSignupErrors,
	}
})
