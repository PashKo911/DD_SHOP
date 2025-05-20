import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { useFacetOptionsStore } from './facetOptions'
import { storeToRefs } from 'pinia'
import { serializeFilter, parseFilter } from '@/utils/filterHelpers'

export const useFilterStore = defineStore('filter', () => {
	const facetOptionsStore = useFacetOptionsStore()
	const { facetOptions } = storeToRefs(facetOptionsStore)

	const filter = reactive({
		text: '',
		styles: [],
		price: [],
		colors: [],
		sizes: [],
	})
	const serializedFilter = computed(() => {
		return serializeFilter(filter, facetOptions.value)
	})

	const hasSelectedFilters = computed(() => {
		return Object.values(filter).some((f) => f.length)
	})

	function parseFilterFromQuery(query) {
		parseFilter(query, filter, facetOptions.value)
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
