import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'

export const useFilterStore = defineStore('filter', () => {
	const filter = reactive({
		style: [],
		price: [],
		color: [],
		size: [],
	})

	const serializedFilter = computed(() => {
		return Object.entries(filter).reduce((q, [key, val]) => {
			if (Array.isArray(val) && val.length) {
				q[key] = val.join(',')
			} else {
				q[key] = val
			}
			return q
		}, {})
	})

	const hasSelectedFilters = computed(() => {
		return Object.values(filter).some((f) => f.length)
	})

	function parseFilterFromQuery(query) {
		for (const key of Object.keys(filter)) {
			const val = query[key]
			if (typeof val === 'string' && val.length && val.includes(',')) {
				if (key === 'price') {
					filter[key] = val.split(',').map(Number)
				} else {
					filter[key] = val.split(',')
				}
			}
		}
	}

	const setFilterProp = (prop, value) => {
		filter[prop] = value
	}

	return {
		filter,
		serializedFilter,
		setFilterProp,
		parseFilterFromQuery,
		hasSelectedFilters,
	}
})
