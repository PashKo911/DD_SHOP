<template>
	<div class="relative flex gap-5">
		<shop-filter
			:styles="filter.styles"
			@update:styles="updateFilter('styles', $event)"
			:price="filter.price"
			@update:price="updateFilter('price', $event)"
			:colors="filter.colors"
			@update:colors="updateFilter('colors', $event)"
			:sizes="filter.sizes"
			@update:sizes="updateFilter('sizes', $event)"
			:facet-options="facetOptionsValue"
			:is-filter-open="isFilterOpen"
			:active-chips="activeChips"
			@reset-price="resetPrice"
			@close-filter="filterVisibilityToggler"
			@remove-chip="removeChip"
			@remove-all="resetFiltersExceptCategory"
			class="lg:w-md-340-290 lg:shrink-0 lg:self-start"
		/>

		<div class="flex grow flex-col">
			<div
				class="flex flex-col-reverse flex-wrap justify-between gap-5 not-last:mb-6 min-[660px]:flex-row min-[660px]:items-center md:gap-8"
			>
				<h3 class="font-heading text-xl leading-tight font-semibold">
					{{ t('pages.shop.title.countTitle', { totalDefaultProductsCount }) }}
				</h3>
				<div class="flex flex-wrap items-center gap-3 md:gap-4">
					<div class="min-w-[11.4375rem] grow">
						<Select
							optionLabel="label"
							fluid
							checkmark
							:modelValue="filter.sort"
							@update:modelValue="updateFilter('sort', $event)"
							@update="updateFilter('sort', $event)"
							:options="optionsData"
							:placeholder="t(shopConstants.defaultSort.label)"
						/>
					</div>
					<div
						class="flex grow flex-wrap items-center justify-end gap-3 md:gap-4"
					>
						<select-button
							:modelValue="viewModeValue"
							@update:modelValue="updateViewMode"
							:options="viewModeData"
							:allowEmpty="false"
							optionLabel="value"
							dataKey="value"
							aria-labelledby="custom"
						>
							<template #option="slotProps">
								<component :is="slotProps.option.icon"> </component>
							</template>
						</select-button>
						<Button
							:label="activeChipsCountString"
							size="small"
							v-if="!isDesktop"
							@click="filterVisibilityToggler"
							class="min-w-11 rounded-md!"
						>
							<template #icon>
								<filter-icon
									class="group-hover:stroke-primary relative shrink-0 stroke-white transition-colors"
								/>
							</template>
						</Button>
					</div>
				</div>
			</div>
			<shop-chips-group
				v-if="activeChips.length && isDesktop"
				:items="activeChips"
				@remove="onRemoveChip"
				@remove-all="resetFiltersExceptCategory"
				class="mb-6"
			/>
			<shop-list
				:items="defaultProductsValue"
				:view-mode="Number(viewMode.value)"
				:is-loading="isProductsLoading"
				class="mb-8 grow"
			/>
			<paginator
				:first="pageFilterValue"
				@update:first="updateFilter('page', $event)"
				v-show="isPaginatorVisible"
				:page-link-size="paginatorButtonsCount"
				:rows="perPage"
				:totalRecords="totalDefaultProductsCount"
			/>
		</div>
		<progress-bar
			mode="indeterminate"
			v-show="isProductsLoading"
			:style="{
				position: 'fixed',
				top: '0',
				left: '0',
				zIndex: '1010',
				width: '100%',
			}"
		/>
		<backdrop
			:visible="isProductsLoading"
			background-class="bg-creamy-cloud/30"
		/>
	</div>
</template>

<script setup>
import {
	computed,
	onMounted,
	onUnmounted,
	ref,
	watch,
	onWatcherCleanup,
} from 'vue'
import { storeToRefs } from 'pinia'

import { useI18n } from 'vue-i18n'
import {
	onBeforeRouteLeave,
	onBeforeRouteUpdate,
	useRoute,
	useRouter,
} from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCommonStore } from '@/stores/common'
import { useFilterStore } from '@/stores/filter'
import { useFacetOptionsStore } from '@/stores/facetOptions'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useWatcherAbortController } from '@/composables/useWatcherAbortController'

import viewModeData from '@/data/viewMode'
import sortOptionsData from '@/data/sortOptions'
import shopConstants from '@/constants/shop'

import ShopFilter from './ShopFilter.vue'
import ShopList from './ShopList.vue'
import Paginator from '@/components/paginator/Paginator.vue'
import SelectButton from '@/components/ui/buttons/SelectButton.vue'
import Select from '@/components/ui/Select.vue'
import ShopChipsGroup from './ShopChipsGroup.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import Button from '@/components/ui/buttons/Button.vue'
import Backdrop from '@/components/ui/Backdrop.vue'
import FilterIcon from '@/components/icons/FilterIcon.vue'
//========================================================================================================================================================

const props = defineProps({
	category: {
		type: String,
		required: true,
	},
})
//========================================================================================================================================================
const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()

const productsStore = useProductsStore()
const filterStore = useFilterStore()
const facetOptionsStore = useFacetOptionsStore()
const commonStore = useCommonStore()

const isDesktop = useMediaQuery('(min-width: 991.98px)')
const isTablet = useMediaQuery('(min-width: 767.98px)')
const isMobile = useMediaQuery('(min-width: 479.98px)')

//========================================================================================================================================================

const { getDefaultProducts, clearDefaultProducts } = productsStore
const { totalDefaultProductsCount, defaultProductsValue, isProductsLoading } =
	storeToRefs(productsStore)

const {
	setFilterProp,
	parseFilterFromQuery,
	resetPrice,
	resetFilters,
	resetFiltersExceptCategory,
	removeChip,
} = filterStore

const { filter, perPage, filterStrings, hasSelectedFilters, activeChips } =
	storeToRefs(filterStore)

const { getFacetOptions } = facetOptionsStore
const { facetOptionsValue } = storeToRefs(facetOptionsStore)

const { viewMode, currency } = storeToRefs(commonStore)
const { setViewMode } = commonStore
const isFilterOpen = ref(false)
//========================================================================================================================================================

const isPaginatorVisible = computed(
	() =>
		totalDefaultProductsCount.value > perPage.value ||
		Number(filter.value.page) !== 0,
)

const optionsData = computed(() => {
	return sortOptionsData.map((o) => ({ ...o, label: t(o.label) }))
})

const viewModeValue = computed(() => {
	const modeNum = perPage.value / shopConstants.productRowsCount

	return viewModeData.find((m) => Number(m.value) === modeNum)
})

const activeChipsCountString = computed(() => {
	return activeChips.value.length ? String(activeChips.value.length) : ''
})

const pageFilterValue = computed(() => filter.value.page * perPage.value)

const paginatorButtonsCount = computed(() => {
	let buttonsCount

	switch (true) {
		case isDesktop.value:
			buttonsCount = 8
			break
		case isTablet.value:
			buttonsCount = 6
			break
		case isMobile.value:
			buttonsCount = 3
			break

		default:
			buttonsCount = 1
			break
	}
	return buttonsCount
})
//========================================================================================================================================================
function updateFilter(key, newValue) {
	let value = newValue

	if (key === 'page') {
		const newPage = Math.floor(value / perPage.value)
		value = newPage
	}

	setFilterProp(key, value)

	router.replace({
		name: route.name,
		query: filterStrings.value,
		params: { ...route.params },
	})
	getDefaultProducts()
}

function updateViewMode(newVal) {
	const newPerPage = newVal.value * shopConstants.productRowsCount
	const newPageByViewMode = Math.floor(
		(filter.value.page * perPage.value) / newPerPage,
	)

	setViewMode(newVal)
	setFilterProp('page', newPageByViewMode)

	router.replace({
		name: route.name,
		query: filterStrings.value,
		params: { ...route.params },
	})
	getDefaultProducts()
}

//========================================================================================================================================================

watch(locale, async () => {
	const { signal } = useWatcherAbortController()

	await getFacetOptions(signal)

	if (hasSelectedFilters.value) {
		resetFiltersExceptCategory()
	}

	await getDefaultProducts(signal)
})

watch(currency, () => {
	const { signal } = useWatcherAbortController()

	getDefaultProducts(signal)
	getFacetOptions(signal)
})

watch(
	() => route.params,
	(newParam, oldParam) => {
		const { signal } = useWatcherAbortController()
		if (newParam.category === oldParam.category) return
		parseFilterFromQuery({ ...route.query, category: route.params.category })
		getDefaultProducts(signal)
	},
)

//========================================================================================================================================================
onMounted(async () => {
	await getFacetOptions()
	parseFilterFromQuery({ ...route.query, category: route.params.category })

	getDefaultProducts()
})

onUnmounted(() => {
	resetFilters()
})

onBeforeRouteLeave(() => {
	clearDefaultProducts()
})

onBeforeRouteUpdate((to, from) => {
	const categoryChanged = from.params.category !== to.params.category
	const pageChanged = from.query.page !== to.query.page

	if (categoryChanged) clearDefaultProducts()

	if (categoryChanged || pageChanged) {
		parseFilterFromQuery({
			...to.query,
			category: to.params.category,
		})
	}
})

//========================================================================================================================================================

const filterVisibilityToggler = () => {
	isFilterOpen.value = !isFilterOpen.value
}

const onRemoveChip = (chip) => {
	removeChip(chip)
	router.replace({
		name: route.name,
		query: filterStrings.value,
		params: { ...route.params, locale: locale.value },
	})
}
</script>
