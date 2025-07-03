<template>
	<div class="relative flex gap-5">
		<shop-filter
			v-model:styles="styleFilterValue"
			v-model:price="priceFilterValue"
			v-model:colors="colorFilterValue"
			v-model:sizes="sizeFilterValue"
			:facet-options="facetOptionsValue"
			:is-filter-open="isFilterOpen"
			:active-chips="activeChips"
			@reset-price="resetPrice"
			@close-filter="filterVisibilityToggler"
			@remove-chip="removeChip"
			@remove-all="resetFiltersExceptGender"
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
							v-model="sortFilterValue"
							optionLabel="label"
							fluid
							checkmark
							:options="optionsData"
							:placeholder="sortFilterValue.label"
						/>
					</div>
					<div
						class="flex grow flex-wrap items-center justify-end gap-3 md:gap-4"
					>
						<select-button
							v-model="viewModeValue"
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
								<FilterIcon
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
				@remove="removeChip"
				@remove-all="resetFiltersExceptGender"
				class="mb-6"
			/>
			<shop-list
				:items="defaultProductsValue"
				:view-mode="Number(viewMode.value)"
				class="mb-8 grow"
			/>
			<paginator
				v-show="isPaginatorVisible"
				v-model:first="pageFilterValue"
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
			background-class="bg-creamy-cloud/50"
		/>
	</div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useFilterModel } from '@/composables/useFilterModel'
import { useProductsStore } from '@/stores/products'
import { useCommonStore } from '@/stores/commonStore'
import { useFilterStore } from '@/stores/filter'
import { useFacetOptionsStore } from '@/stores/facetOptions'
import { useMediaQuery } from '@/composables/useMediaQuery'

import viewModeData from '@/data/viewModeData'
import sortOptionsData from '@/data/sortOptionsData'

import ShopFilter from './ShopFilter.vue'
import ShopList from './ShopList.vue'
import Paginator from '@/components/paginator/Paginator.vue'
import SelectButton from '@/components/ui/buttons/SelectButton.vue'
import Select from '@/components/ui/select/Select.vue'
import ShopChipsGroup from './ShopChipsGroup.vue'
import ProgressBar from '@/components/ui/progressBar/ProgressBar.vue'
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

const { getDefaultProducts } = productsStore
const {
	totalDefaultProductsCount,
	defaultProducts,
	defaultProductsValue,
	isProductsLoading,
} = storeToRefs(productsStore)

const {
	setFilterProp,
	parseFilterFromQuery,
	resetPrice,
	resetAllFilters,
	resetFiltersExceptGender,
	removeChip,
} = filterStore

const {
	filter,
	perPage,
	filterStrings,
	hasSelectedFilters,
	hasQueryFilters,
	activeChips,
} = storeToRefs(filterStore)

const { getFacetOptions } = facetOptionsStore
const { facetOptionsValue, isFacetOptionsLoaded } =
	storeToRefs(facetOptionsStore)

const { viewMode } = storeToRefs(commonStore)
const { setViewMode } = commonStore
const isFilterOpen = ref(false)
//========================================================================================================================================================

const isPaginatorVisible = computed(
	() =>
		totalDefaultProductsCount.value > perPage.value ||
		Number(filter.value.page) !== 0,
)

const styleFilterValue = useFilterModel('styles')
const priceFilterValue = useFilterModel('price')
const colorFilterValue = useFilterModel('colors')
const sizeFilterValue = useFilterModel('sizes')

const sortFilterValue = computed({
	get() {
		return filter.value.sort
	},
	set(newVal) {
		setFilterProp('sort', newVal)
	},
})

const pageFilterValue = computed({
	get() {
		return filter.value.page * perPage.value
	},
	set(newVal) {
		console.log(newVal)
		const newPage = Math.floor(newVal / perPage.value)
		setFilterProp('page', newPage)
	},
})
const currentGenderId = computed(() => {
	const found = facetOptionsValue.value.genders?.find(
		(g) => g.label.en === props.category,
	)
	return found?._id ?? null
})

const optionsData = computed(() => {
	return sortOptionsData.map(({ label, value }) => ({ value, label: t(label) }))
})

const viewModeValue = computed({
	get() {
		const modeNum = perPage.value / 3
		const mode = viewModeData.find((m) => Number(m.value) === modeNum)

		return mode
	},
	async set(newVal) {
		const newPerPage = newVal.value * 3
		const productsCount = defaultProducts.value.documents.length
		const newPageByViewMode = Math.floor(
			(filter.value.page * perPage.value) / newPerPage,
		)

		setViewMode(newVal)

		if (newPageByViewMode !== filter.value.page) {
			setFilterProp('page', newPageByViewMode)
			return
		}

		if (
			newPerPage > productsCount &&
			totalDefaultProductsCount.value > productsCount
		) {
			await getDefaultProducts()
		}
	},
})

const activeChipsCountString = computed(() => {
	return activeChips.value.length ? String(activeChips.value.length) : ''
})

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

watch(locale, async () => {
	resetAllFilters()
	setFilterProp('gender', currentGenderId.value)
	await getFacetOptions()
})
watch(currentGenderId, async (newVal, oldVal) => {
	if (oldVal) {
		resetAllFilters()
	}
	setFilterProp('gender', newVal)
})

//========================================================================================================================================================

let unwatch
onMounted(async () => {
	if (!isFacetOptionsLoaded.value) {
		await getFacetOptions()
	}

	setFilterProp('gender', currentGenderId.value)

	if (hasQueryFilters.value) {
		parseFilterFromQuery(route.query)
	}

	if (hasSelectedFilters.value) {
		router.push({ query: filterStrings.value })
	}

	await getDefaultProducts()

	unwatch = watch(filter.value, async (newVal, oldVal) => {
		router.replace({ query: filterStrings.value })
		await getDefaultProducts()
	})
})

onUnmounted(() => {
	if (typeof unwatch === 'function') {
		unwatch()
	}
	resetAllFilters()
	setFilterProp('gender', '')
})
//========================================================================================================================================================

const filterVisibilityToggler = () => {
	isFilterOpen.value = !isFilterOpen.value
}
</script>
