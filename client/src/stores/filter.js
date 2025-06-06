import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { useFacetOptionsStore } from './facetOptions'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { serializeFilter, parseFilter } from '@/utils/filterHelpers'

const DEFAULT_FILTER = {
	gender: '',
	title: '',
	styles: [],
	price: [],
	colors: [],
	sizes: [],
	page: 0,
	perPage: 9,
}

export const useFilterStore = defineStore('filter', () => {
	const route = useRoute()
	const facetOptionsStore = useFacetOptionsStore()
	const { facetOptions } = storeToRefs(facetOptionsStore)

	const filter = reactive({ ...DEFAULT_FILTER })

	const displayFilterString = computed(() => {
		return serializeFilter(filter, facetOptions.value)
	})

	const apiQueryParams = computed(() => {
		return {
			gender: filter.gender,
			title: filter.title,
			styles: filter.styles.join(','),
			colors: filter.colors.join(','),
			sizes: filter.sizes.join(','),
			price: filter.price,
			page: filter.page,
			perPage: filter.perPage,
		}
	})

	const hasSelectedFilters = computed(() => {
		return Object.entries(filter).some(([key, val]) => {
			const def = DEFAULT_FILTER[key]

			if (key === 'gender') return false

			if (Array.isArray(def)) {
				return Array.isArray(val) && val.length > 0
			}

			return val !== def
		})
	})

	const hasQueryFilters = computed(() => {
		return Boolean(Object.keys(route.query).length)
	})

	function parseFilterFromQuery(query) {
		parseFilter(query, filter, facetOptions.value)
	}

	const setFilterProp = (prop, value) => {
		if (prop !== 'page' && filter.page !== 0) {
			filter.page = 0
		}
		filter[prop] = value
	}
	const resetPrice = () => {
		filter.price = []
	}
	const clearFilter = () => {
		Object.assign(filter, DEFAULT_FILTER)
	}

	return {
		filter,
		displayFilterString,
		setFilterProp,
		parseFilterFromQuery,
		hasSelectedFilters,
		hasQueryFilters,
		apiQueryParams,
		resetPrice,
		clearFilter,
	}
})
