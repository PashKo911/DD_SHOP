import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Reactive media query hook.
 *
 * @param {string} query CSS media query
 * @returns {import('vue').Ref<boolean>} true if query matches
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 767.98px)')
 */

export function useMediaQuery(query) {
	const matches = ref(false)
	let mediaQueryList = null

	const updateMatches = (e) => {
		matches.value = e.matches
	}

	onMounted(() => {
		if (typeof window !== 'undefined' && window.matchMedia) {
			mediaQueryList = window.matchMedia(query)

			matches.value = mediaQueryList.matches

			mediaQueryList.addEventListener('change', updateMatches)
		}
	})

	onUnmounted(() => {
		if (mediaQueryList) {
			mediaQueryList.removeEventListener('change', updateMatches)
		}
	})

	return matches
}
