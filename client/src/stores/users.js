import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { useGeneralStore } from './general'
import apiClient from '@/config/axios'
import apiEndpoints from '@/api/apiEndpoints'

export const useUsersStore = defineStore('users', () => {
	const { generalApiOperation, isLoading } = useGeneralStore()

	const users = ref([])
	const userTypes = ref([])
	//========================================================================================================================================================

	const usersValue = computed(() => users.value)
	const userTypesValue = computed(() => userTypes.value)
	//========================================================================================================================================================
	const isUsersLoading = computed(() => isLoading('fetchUsers'))
	const isUserTypesLoading = computed(() => isLoading('getUserTypes'))

	const isSetUserTypeLoading = (id) => {
		return computed(() => isLoading(`setUserType-${id}`))
	}
	const isDeleteUserLoading = (id) => {
		return computed(() => isLoading(`deleteUser-${id}`))
	}
	//========================================================================================================================================================

	const fetchUsers = async () => {
		return await generalApiOperation({
			operationName: 'fetchUsers',
			operation: async () => {
				const response = await apiClient(apiEndpoints.admin.fetchUsers)
				users.value = response.data.data
				return response.data.data
			},
		})
	}

	const getUserTypes = async () => {
		return await generalApiOperation({
			operationName: 'getUserTypes',
			operation: async () => {
				const response = await apiClient.get(apiEndpoints.types.getTypes)
				userTypes.value = response?.data?.data
				return response?.data?.data
			},
		})
	}

	const setUserType = async ({ _id, typeId }) => {
		return await generalApiOperation({
			operationName: `setUserType-${_id}`,
			operation: async () => {
				const response = await apiClient.patch(
					apiEndpoints.admin.updateUserType(_id),
					{ typeId },
				)
				return response?.data?.data
			},
		})
	}

	const updateUserInState = (user) => {
		const { _id } = user
		const index = users.value.findIndex((u) => u._id === _id)
		if (index !== -1) {
			users.value[index] = { ...user }
		}
	}

	const deleteUser = async (_id) => {
		return await generalApiOperation({
			operationName: `deleteUser-${_id}`,
			operation: async () => {
				const response = await apiClient.delete(
					apiEndpoints.admin.deleteUser(_id),
				)
				return response.data
			},
		})
	}

	return {
		// Refs
		users,
		userTypes,

		// Computed
		usersValue,
		userTypesValue,

		// Status
		isUsersLoading,
		isSetUserTypeLoading,
		isUserTypesLoading,
		isDeleteUserLoading,

		// Actions
		fetchUsers,
		getUserTypes,
		setUserType,
		updateUserInState,
		deleteUser,
	}
})
