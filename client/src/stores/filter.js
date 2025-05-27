import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { useFacetOptionsStore } from './facetOptions'
import { storeToRefs } from 'pinia'
import { serializeFilter, parseFilter } from '@/utils/filterHelpers'

export const useFilterStore = defineStore('filter', () => {
	const facetOptionsStore = useFacetOptionsStore()
	const { facetOptions } = storeToRefs(facetOptionsStore)

	const filter = reactive({
		title: '',
		styles: [],
		price: [],
		colors: [],
		sizes: [],
		page: 0,
		perPage: 9,
	})

	const displayFilterString = computed(() => {
		return serializeFilter(filter, facetOptions.value)
	})

	const apiQueryParams = computed(() => {
		return {
			text: filter.text,
			styles: filter.styles.join(','),
			colors: filter.colors.join(','),
			sizes: filter.sizes.join(','),
			price: filter.price,
			page: filter.page,
			perPage: filter.perPage,
		}
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
	const resetPrice = () => {
		filter.price = []
	}

	return {
		filter,
		displayFilterString,
		setFilterProp,
		parseFilterFromQuery,
		hasSelectedFilters,
		apiQueryParams,
		resetPrice,
	}
})
