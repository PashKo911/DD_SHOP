import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGeneralStore = defineStore('general', () => {
	const loading = ref(null)
	const error = ref(null)

	const isLoading = computed(() => loading.value)
	const hasError = computed(() => error.value)

	function setLoading(val) {
		loading.value = val
	}
	function setError(val) {
		error.value = val
	}
	function startLoading() {
		setLoading(true)
		setError(null)
	}

	async function generalApiOperation({
		operation,
		successCallback,
		errorCallBack,
	}) {
		startLoading()

		try {
			const res = await operation()
			if (successCallback) successCallback(res)
			return res
		} catch (error) {
			setError(error)
			if (errorCallBack) errorCallBack(error)
		} finally {
			setLoading(false)
		}
	}

	return {
		isLoading,
		hasError,
		setLoading,
		setError,
		startLoading,
		generalApiOperation,
	}
})
