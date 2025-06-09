import { defineStore } from 'pinia'
import { storeToRefs } from 'pinia'
import { reactive, computed } from 'vue'

import { useFacetOptionsStore } from './facetOptions'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import parseFilter from '@/utils/parseFilter'
import serializeFilter from '@/utils/serializeFilter'
import sortOptionsData from '@/data/sortOptionsData'

export const useFilterStore = defineStore('filter', () => {
	const route = useRoute()
	const facetOptionsStore = useFacetOptionsStore()
	const { t } = useI18n()
	const { facetOptions } = storeToRefs(facetOptionsStore)

	const defaultFilter = computed(() => ({
		gender: '',
		title: '',
		styles: [],
		price: [],
		colors: [],
		sizes: [],
		sort: {
			label: t(sortOptionsData[3].label),
			value: sortOptionsData[3].value,
		},
		page: 0,
		perPage: 9,
	}))

	const filter = reactive({ ...defaultFilter.value })

	const displayFilterString = computed(() => {
		return serializeFilter(filter, facetOptions.value, defaultFilter.value)
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
			sort: filter.sort.value,
			perPage: filter.perPage,
		}
	})

	const hasSelectedFilters = computed(() => {
		return Object.entries(filter).some(([key, val]) => {
			const def = defaultFilter.value[key]

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
		parseFilter(
			query,
			filter,
			defaultFilter.value,
			facetOptions.value,
			sortOptionsData,
			t,
		)
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
		Object.assign(filter, defaultFilter.value)
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
