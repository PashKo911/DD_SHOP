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
			<div class="not-last:mb-6">
				<h3 class="font-heading text-xl leading-tight font-semibold">
					{{ t('pages.shop.title.countTitle', { count }) }}
				</h3>
			</div>
			<shop-list :items="productsValue" class="mb-8" />
			<paginator
				v-if="isPaginatorVisible"
				v-model="filter.page"
				:rows="filter.perPage"
				:totalRecords="count"
				@page="onPageChange"
			/>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useFilterModel } from '@/composables/useFilterModel'
import { useProductsStore } from '@/stores/products'
import { useFilterStore } from '@/stores/filter'
import { useFacetOptionsStore } from '@/stores/facetOptions'

import ShopFilter from './ShopFilter.vue'
import ShopList from './ShopList.vue'
import Paginator from '@/components/paginator/Paginator.vue'
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

const { setFilterProp, parseFilterFromQuery, resetPrice } = filterStore

const { filter, displayFilterString, hasSelectedFilters, hasQueryFilters } =
	storeToRefs(filterStore)

const { getFacetOptions } = facetOptionsStore
const { facetOptionsValue } = storeToRefs(facetOptionsStore)
//========================================================================================================================================================

const isPaginatorVisible = computed(() => count.value > filter.value.perPage)

const styleFilterValue = useFilterModel('styles')
const priceFilterValue = useFilterModel('price')
const colorFilterValue = useFilterModel('colors')
const sizeFilterValue = useFilterModel('sizes')
//========================================================================================================================================================

watch(filter.value, async () => {
	router.replace({ query: displayFilterString.value })
	await getProducts()
})

watch(locale, async () => {
	await getFacetOptions()
	resetPrice()
})
//========================================================================================================================================================

const onPageChange = ({ page }) => {
	console.log(page)
	setFilterProp('page', page)
}
//========================================================================================================================================================

onMounted(async () => {
	await getFacetOptions()

	if (hasQueryFilters.value) {
		parseFilterFromQuery(route.query)
	}

	if (hasSelectedFilters.value) {
		router.push({ query: displayFilterString.value })
	}

	await getProducts()
})
</script>
