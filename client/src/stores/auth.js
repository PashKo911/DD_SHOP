import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/api/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'
import { useGeneralStore } from './general'
import { useUsersStore } from './users'

export const useAuthStore = defineStore('auth', () => {
	const generalStore = useGeneralStore()
	const usersStore = useUsersStore()
	const { generalApiOperation } = generalStore

	const user = ref(null)
	const token = ref(localStorage.getItem('token') || null)
	//========================================================================================================================================================

	const currentUserPermissions = computed(() => user.value?.permissions || {})
	//========================================================================================================================================================

	const setToken = (newToken) => {
		token.value = newToken
		if (newToken) {
			localStorage.setItem('token', newToken)
		} else {
			localStorage.removeItem('token')
		}
	}

	const login = async (username, password) => {
		return generalApiOperation({
			operation: async () => {
				const response = await apiClient.post(apiEndpoints.auth.login(), {
					username,
					password,
				})

				setToken(response.data.token)
				user.value = response.data.user
				return response.data.user
			},
		})
	}

	const getUserProfileByToken = async () => {
		const currentToken = localStorage.getItem('token')

		if (!currentToken) return null
		return generalApiOperation({
			operation: async () => {
				const response = await apiClient.get(apiEndpoints.auth.profileByToken())
				setToken(response.data.token)
				user.value = response.data.user
				return response.data.user
			},
		})
	}

	const register = async (email, password) => {
		return generalApiOperation({
			operation: async () => {
				const response = await apiClient.post(apiEndpoints.auth.register(), {
					email,
					password,
				})

				setToken(response.data.token)
				user.value = response.data.user
				return response.data
			},
		})
	}

	const logout = () => {
		setToken(null)
		user.value = null
	}

	return {
		// refs
		user,
		token,

		// computed
		currentUserPermissions,

		// actions
		getUserProfileByToken,
		login,
		register,
		logout,
	}
})
