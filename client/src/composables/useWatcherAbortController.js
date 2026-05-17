import { onWatcherCleanup } from 'vue'

export function useWatcherAbortController() {
	const controller = new AbortController()

	onWatcherCleanup(() => {
		controller.abort()
	})

	return {
		signal: controller.signal,
	}
}
