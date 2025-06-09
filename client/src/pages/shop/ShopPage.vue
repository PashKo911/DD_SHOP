<template>
	<div class="flex items-start gap-5">
		<shop-filter
			class="w-[340px] shrink-0"
			v-model:styles="styleFilterValue"
			v-model:price="priceFilterValue"
			v-model:colors="colorFilterValue"
			v-model:sizes="sizeFilterValue"
			:facet-options="facetOptionsValue"
			@reset-price="resetPrice"
		/>

		<div class="grow">
			<div
				class="flex flex-wrap items-center justify-between gap-8 not-last:mb-6"
			>
				<h3 class="font-heading text-xl leading-tight font-semibold">
					{{ t('pages.shop.title.countTitle', { count }) }}
				</h3>

				<div class="flex flex-wrap items-center gap-4">
					<div class="min-w-[14.5rem]">
						<Select
							v-model="sortFilterValue"
							optionLabel="label"
							fluid
							checkmark
							:options="optionsData"
							:placeholder="sortFilterValue.label"
						/>
					</div>
					<select-button
						v-model="viewMode"
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
				</div>
			</div>
			<shop-list
				:items="productsValue"
				:view-mode="viewMode.value"
				class="mb-8"
			/>
			<paginator
				v-if="isPaginatorVisible"
				v-model:first="pageFilterValue"
				:rows="filter.perPage"
				:totalRecords="count"
			/>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useFilterModel } from '@/composables/useFilterModel'
import { useProductsStore } from '@/stores/products'
import { useFilterStore } from '@/stores/filter'
import { useFacetOptionsStore } from '@/stores/facetOptions'

import viewModeData from '@/data/viewModeData'
import sortOptionsData from '@/data/sortOptionsData'

import ShopFilter from './ShopFilter.vue'
import ShopList from './ShopList.vue'
import Paginator from '@/components/paginator/Paginator.vue'
import SelectButton from '@/components/ui/selectButton/SelectButton.vue'
import Select from '@/components/ui/select/Select.vue'
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
//========================================================================================================================================================

const { getProducts } = productsStore
const { count, productsValue } = storeToRefs(productsStore)

const { setFilterProp, parseFilterFromQuery, resetPrice, clearFilter } =
	filterStore

const { filter, displayFilterString, hasSelectedFilters, hasQueryFilters } =
	storeToRefs(filterStore)

const { getFacetOptions } = facetOptionsStore
const { facetOptionsValue, isFacetOptionsLoaded } =
	storeToRefs(facetOptionsStore)

const viewMode = ref(viewModeData[0])
//========================================================================================================================================================

const isPaginatorVisible = computed(() => count.value > filter.value.perPage)

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
		return filter.value.page * filter.value.perPage
	},
	set(newVal) {
		const newPage = Math.floor(newVal / filter.value.perPage)
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
//========================================================================================================================================================

watch(locale, async () => {
	await getFacetOptions()
	clearFilter()
	setFilterProp('gender', currentGenderId.value)
})
watch(currentGenderId, async () => {
	clearFilter()
	setFilterProp('gender', currentGenderId.value)
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
		router.push({ query: displayFilterString.value })
	}

	await getProducts()

	unwatch = watch(filter.value, async () => {
		router.replace({ query: displayFilterString.value })
		await getProducts()
	})
})

onUnmounted(() => {
	if (typeof unwatch === 'function') {
		unwatch()
	}
	clearFilter()
	setFilterProp('gender', '')
})
</script>
