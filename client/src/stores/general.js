import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useGeneralStore = defineStore('general', () => {
	const loadingStates = reactive({})
	const errorStates = reactive({})
	//========================================================================================================================================================

	function isLoading(operationName) {
		return Boolean(loadingStates[operationName])
	}
	function hasError(operationName) {
		return errorStates[operationName] || null
	}

	function setLoading(operationName, val) {
		loadingStates[operationName] = val
	}
	function setError(operationName, val) {
		errorStates[operationName] = val
	}
	function startLoading(operationName) {
		setLoading(operationName, true)
		setError(operationName, null)
	}

	async function generalApiOperation({
		operationName,
		operation,
		successCallback,
		errorCallback,
	}) {
		if (!operationName) {
			throw new Error('generalApiOperation: operationName is required')
		}

		startLoading(operationName)

		try {
			const res = await operation()
			if (successCallback) successCallback(res)
			return res
		} catch (err) {
			console.error(err)
			setError(operationName, err)
			if (errorCallback) errorCallback(err)
		} finally {
			setLoading(operationName, false)
		}
	}

	return {
		// refs
		loadingStates,
		errorStates,

		// actions
		isLoading,
		hasError,
		setLoading,
		setError,
		startLoading,
		generalApiOperation,
	}
})
