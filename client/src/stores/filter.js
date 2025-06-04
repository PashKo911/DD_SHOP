import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { useFacetOptionsStore } from './facetOptions'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { serializeFilter, parseFilter } from '@/utils/filterHelpers'

export const useFilterStore = defineStore('filter', () => {
	const route = useRoute()
	const facetOptionsStore = useFacetOptionsStore()
	const { facetOptions } = storeToRefs(facetOptionsStore)

	const filter = reactive({
		gender: '',
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
		return Object.keys(filter).some((k) => {
			if (Array.isArray(filter[k])) return filter[k].length
			if (k === 'perPage') return false
			return Boolean(filter[k])
		})
	})

	const hasQueryFilters = computed(() => {
		return Object.keys(route.query).length
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
		filter.title = ''
		filter.styles = []
		filter.colors = []
		filter.sizes = []
		filter.price = []
		filter.page = 0
		filter.perPage = 9
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
