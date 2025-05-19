import { computed } from 'vue'

/**
 * Returns a computed property bound to any field in a Pinia store,
 * including nested fields accessed via a dot-separated path. :contentReference[oaicite:0]{index=0}
 *
 * @param {object} store — the Pinia store instance to bind to. :contentReference[oaicite:1]{index=1}
 * @param {string} propPath — a dot-separated path to the desired field
 *                            (e.g., "filter.style"). :contentReference[oaicite:2]{index=2}
 */

export function useFilterModel(storeState, prop, callback) {
	return computed({
		get() {
			return storeState[prop]
		},
		set(newVal) {
			callback(prop, newVal)
		},
	})
}
