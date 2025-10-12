import { defineStore } from 'pinia'
import { storeToRefs } from 'pinia'
import { reactive, computed } from 'vue'

import { useFacetOptionsStore } from './facetOptions'
import { useCommonStore } from './common'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import parseFilter from '@/utils/filterHelpers/parseFilter'
import serializeFilter from '@/utils/filterHelpers/serializeFilter'
import sortOptionsData from '@/data/sortOptions'
import mapFilterToChips from '@/utils/filterHelpers/mapFilterToChips'
import { removeFilterChip } from '@/utils/filterHelpers/removeFilterChip'
import shopConstants from '@/constants/shop'

export const useFilterStore = defineStore('filter', () => {
	const route = useRoute()
	const facetOptionsStore = useFacetOptionsStore()
	const commonStore = useCommonStore()

	const { t, n, locale } = useI18n()
	const { facetOptions, currency } = storeToRefs(facetOptionsStore)
	const { viewMode } = storeToRefs(commonStore)

	const defaultFilter = computed(() => ({
		gender: '',
		title: '',
		styles: [],
		price: [],
		colors: [],
		sizes: [],
		sort: shopConstants.defaultSort,
		page: 0,
	}))

	const perPage = computed(() => {
		return viewMode.value.value * 3
	})

	const filter = reactive({ ...defaultFilter.value })

	const filterStrings = computed(() => {
		return serializeFilter(
			filter,
			facetOptions.value,
			defaultFilter.value,
			locale.value,
		)
	})

	const apiQueryParams = computed(() => {
		return {
			gender: filter.gender,
			title: filter.title.trim().toLowerCase(),
			styles: filter.styles.join(','),
			colors: filter.colors.join(','),
			sizes: filter.sizes.join(','),
			price: filter.price,
			page: filter.page,
			sort: filter.sort.value,
			perPage: perPage.value,
		}
	})

	const hasSelectedFilters = computed(() => {
		return Object.entries(filter).some(([key, val]) => {
			const def = defaultFilter.value[key]

			if (key === 'gender') return false

			if (key === 'sort') {
				return val.value !== def.value
			}

			if (Array.isArray(def)) {
				return Array.isArray(val) && val.length > 0
			}

			return val !== def
		})
	})

	const hasQueryFilters = computed(() => {
		return Boolean(Object.keys(route.query).length)
	})

	const activeChips = computed(() => {
		return mapFilterToChips(filter, facetOptions.value, defaultFilter.value, n)
	})
	//========================================================================================================================================================

	function parseFilterFromQuery(query) {
		const res = parseFilter(
			query,
			filter,
			defaultFilter.value,
			facetOptions.value,
			sortOptionsData,
			t,
			locale.value,
		)

		console.log(res, 'parseFilterFromQuery')
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
	const resetAllFilters = () => {
		Object.assign(filter, defaultFilter.value)
	}
	const resetFiltersExceptTitle = () => {
		const currentTitle = filter.title

		Object.assign(filter, defaultFilter.value)

		filter.title = currentTitle
	}
	function removeChip(chip) {
		removeFilterChip(filter, defaultFilter.value, chip)
	}

	return {
		// refs
		filter,

		// computed
		defaultFilter,
		perPage,
		activeChips,
		filterStrings,
		hasSelectedFilters,
		hasQueryFilters,
		apiQueryParams,

		// actions
		parseFilterFromQuery,
		setFilterProp,
		resetPrice,
		resetAllFilters,
		resetFiltersExceptTitle,
		removeChip,
	}
})
