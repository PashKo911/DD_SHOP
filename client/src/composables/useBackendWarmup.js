import axios from 'axios'
import { computed, readonly, ref } from 'vue'

import apiConfig from '@/config/api'

const LOADER_DELAY_MS = 700

const isWarmingUp = ref(false)
const isBackendReady = ref(false)
const warmupError = ref(null)
const warmupPromise = ref(null)
const isWarmupVisible = ref(false)
const pendingVisibleTimeout = ref(null)

function clearPendingVisibleTimeout() {
	if (pendingVisibleTimeout.value) {
		clearTimeout(pendingVisibleTimeout.value)
		pendingVisibleTimeout.value = null
	}
}

function showWarmupLoaderWithDelay() {
	clearPendingVisibleTimeout()

	pendingVisibleTimeout.value = setTimeout(() => {
		if (isWarmingUp.value && !isBackendReady.value) {
			isWarmupVisible.value = true
		}
		pendingVisibleTimeout.value = null
	}, LOADER_DELAY_MS)
}

function resetWarmupPresentation() {
	isWarmingUp.value = false
	isWarmupVisible.value = false
	clearPendingVisibleTimeout()
}

async function requestBackendReady() {
	await axios.get(`${apiConfig.apiUrl}/health`, {
		timeout: 60000,
	})
}

async function warmupBackend() {
	if (isBackendReady.value) {
		return true
	}

	if (warmupPromise.value) {
		return warmupPromise.value
	}

	isWarmingUp.value = true
	warmupError.value = null
	showWarmupLoaderWithDelay()

	warmupPromise.value = requestBackendReady()
		.then(() => {
			isBackendReady.value = true
			resetWarmupPresentation()
			return true
		})
		.catch((error) => {
			warmupError.value = error
			isWarmupVisible.value = true
			isWarmingUp.value = false
			clearPendingVisibleTimeout()
			throw error
		})
		.finally(() => {
			warmupPromise.value = null
		})

	return warmupPromise.value
}

const shouldShowWarmupLoader = computed(() => {
	return isWarmupVisible.value && !isBackendReady.value
})

export function useBackendWarmup() {
	return {
		isWarmingUp: readonly(isWarmingUp),
		isBackendReady: readonly(isBackendReady),
		warmupError: readonly(warmupError),
		warmupPromise: readonly(warmupPromise),
		shouldShowWarmupLoader: readonly(shouldShowWarmupLoader),
		warmupBackend,
	}
}
