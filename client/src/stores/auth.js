import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'

import { useGeneralStore } from './general'
import { useUsersStore } from './users'

import apiClient from '@/config/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'
import authErrorsFormatter from '@/utils/errorHelpers/authErrorsFormatter'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
	const generalStore = useGeneralStore()
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
		return authErrorsFormatter(axiosErr)
	})

	const isSigninLoading = computed(() => {
		return isLoading('signin')
	})

	const signinServerValidationErrors = computed(() => {
		const axiosErr = hasError('signin')
		return authErrorsFormatter(axiosErr)
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

	const getTokenAndUserDataWithGoogle = async (googleAuthCode) => {
		const result = await generalApiOperation({
			operationName: 'getTokenAndUserDataWithGoogle',
			operation: async () => {
				const response = await apiClient.post(
					apiEndpoints.auth.authWithGoogle,
					{
						code: googleAuthCode.code,
					},
				)
				return response
			},
			successCallback: () => {
				router.push({ name: 'home' })
			},
		})
		user.value = result.data.user
		setToken(result.data.token)
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

	const signin = async ({ email, password }) => {
		return generalApiOperation({
			operationName: 'signin',
			operation: async () => {
				const response = await apiClient.post(apiEndpoints.auth.signin, {
					email,
					password,
				})

				setToken(response.data.token)
				user.value = response.data.user
				return response.data.user
			},
			successCallback: () => {
				router.push({ name: 'home' })
			},
		})
	}

	const signup = async ({ email, password }) => {
		return generalApiOperation({
			operationName: 'signup',
			operation: async () => {
				const response = await apiClient.post(apiEndpoints.auth.signup, {
					email,
					password,
				})

				setToken(response.data.token)
				user.value = response.data.user
				return response.data
			},
			successCallback: () => {
				router.push({ name: 'home' })
			},
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
		getTokenAndUserDataWithGoogle,
		signup,
		signout,
		clearSigninErrors,
		clearSignupErrors,
	}
})
