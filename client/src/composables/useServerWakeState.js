import { readonly, ref } from 'vue'

const SHOW_DELAY_MS = 700

const isServerWakeVisible = ref(false)
const hasBackendResponded = ref(false)
const hasStartedFirstRequest = ref(false)
const pendingWakeTimeout = ref(null)

function clearPendingWakeTimeout() {
	if (pendingWakeTimeout.value) {
		clearTimeout(pendingWakeTimeout.value)
		pendingWakeTimeout.value = null
	}
}

function beginBackendWakeCheck() {
	if (hasBackendResponded.value || hasStartedFirstRequest.value) return

	hasStartedFirstRequest.value = true
	clearPendingWakeTimeout()

	pendingWakeTimeout.value = setTimeout(() => {
		if (!hasBackendResponded.value) {
			isServerWakeVisible.value = true
		}
		pendingWakeTimeout.value = null
	}, SHOW_DELAY_MS)
}

function markBackendAwake() {
	if (hasBackendResponded.value) return

	hasBackendResponded.value = true
	isServerWakeVisible.value = false
	clearPendingWakeTimeout()
}

export function useServerWakeState() {
	return {
		isServerWakeVisible: readonly(isServerWakeVisible),
		hasBackendResponded: readonly(hasBackendResponded),
		pendingWakeTimeout: readonly(pendingWakeTimeout),
		beginBackendWakeCheck,
		markBackendAwake,
	}
}
