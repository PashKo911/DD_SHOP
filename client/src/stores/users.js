import { defineStore } from 'pinia'
// import getStoreTemplate from './helpers/storeTemplate'
import { useAuthStore } from './auth'

export const useUsersStore = defineStore('users', () => {
	const authStore = useAuthStore()
	//   const template = getStoreTemplate('users')

	return {
		// ...template
	}
})
