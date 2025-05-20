import { computed } from 'vue'

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
